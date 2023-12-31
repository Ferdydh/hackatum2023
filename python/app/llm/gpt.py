import json
from dotenv import load_dotenv
load_dotenv(override=True)
from .utils import schema_to_openai_func, call_requested_function, register_tool, chunk_stream, add_line_numbers
from .userproject import UserProject, FakeProject
from app.models import NewFile, DirectoryUpdate, OpenFile, EditFile, TerminalExecute, TerminalUpdate, SpeechBubble, OpenSettings, ToggleTheme
from app.services.api_service import recursive_convert
from openai import AsyncOpenAI
import re

client = AsyncOpenAI()

MAX_CALLS_PER_PROMPT = 100

SYSTEM = """
You are an AI copilot directly integrated into an IDE. You have full access to the interface of the IDE by calling the provided function tools such as creating new files, opening files, and executing commands on the integrated terminal or writing the corresponding markdown code blocks.
When the user requests something, you should call a sequence of functions or write corresponding markdown code blocks with the special syntax, separately one by one.
If you write a markdown code block, do not call a function. If you call a function, do not write a markdown code block. When writing the markdown code block, do not say anything else.
Inserting, removing and replacing lines are done in the file that was lastly opened by the open_file tool, therefore a file must always be opened before editing the text in it.
While removing is simply done by function tool call remove_lines(start,end), inserting and replacing are done by the following special syntax:

In order to insert code to the currently open file, you write a markdown code block with a special syntax INSERT_AT_LINE(line_number) followed by the content to be inserted. 
For the example of inserting the code `print('hello world')`, you write the following markdown code block:
```INSERT_AT_LINE(1)
print('hello world')
```
The content of the markdown block will be inserted into the currently open file at the line number line_number.

In order to replace code of the currently open file, you write a markdown code block with a special syntax REPLACE_AT_LINE(start,end) followed by the content to be inserted instead of the lines between start and end. 
For example, you write the following markdown code block to replace the first line of the currently open file with the code "print('hello world')":
```REPLACE_AT_LINE(1,1)
print('hello world')
```
For example, when the user requests "make and run a simple hello world python program", you should call the following functions and write the equivalent markdown code block to insert code:
1. new_file(full_path="src/main.py")
2. open_file(full_path="src/main.py")
3. ```INSERT_AT_LINE(1)
print('hello world')
```
4. execute_command(command="python src/main.py")

The current open file updates over time as you and the user edit it.
"""

def with_latest_state(state: UserProject):
    current_file = state.get_current_file()
    current_file_content = state.get_all_files().get(current_file, "")
    if current_file:
        return SYSTEM + f"""
Currently the file `{current_file}` is open.
[OPEN FILE CONTENT]:
```
{add_line_numbers(current_file_content)}
```
For each line in the file, the line number is shown on the left with a |. You can use the line numbers to refer to specific lines in the file when calling the insert_lines, remove_lines and replace_lines tools.
    """
    else:
        return SYSTEM + "Currently no file is open."
    
# handle all tool calls until there are no more tool calls
async def prompt(messages: list, prompt: str, state: UserProject):
    tools, func_lookup = state.register_all_tools()
    messages.append({"role": "user", "content": prompt})
    
    # keep calling the completion endpoint until there are no more tool calls
    for i in range(MAX_CALLS_PER_PROMPT):
        completion = await client.chat.completions.create(
            model="gpt-4-1106-preview",
            messages=[{"role": "system", "content": with_latest_state(state)}] + messages,
            tools=tools,
            tool_choice="auto",
            temperature=0.0,
        )
        new_msg = completion.choices[0].message
        messages.append(new_msg)

        if new_msg.tool_calls:
            for tool_call in new_msg.tool_calls:
                f = tool_call.function
                print(f"Calling function: {f.name}, args = {f.arguments}")
                ret_val = await call_requested_function(f, func_lookup)
                print(f"Returned: {ret_val}")

                # insert the return value into the message
                messages.append({"role": "tool", "content": ret_val, "tool_call_id": tool_call.id})
        else:
            return messages

def parse_code(input_string):
    # Define the regex pattern to match both INSERT_AT_LINE and REPLACE_AT_LINE
    # with potential extra new lines or spaces before and after the actual content
    pattern = r'```\s*(INSERT_AT_LINE|REPLACE_AT_LINE)\((\d+)(?:,(\d+))?\)\n(.*?)\s*```'

    # Search for the pattern in the input string
    match = re.search(pattern, input_string, re.DOTALL)

    if match:
        # Extract the matched groups
        prefix = match.group(1)
        start_line = int(match.group(2))
        # For REPLACE_AT_LINE, extract the end line, otherwise None
        end_line = int(match.group(3)) if match.group(3) else None
        code = match.group(4).strip()
        return prefix, start_line, end_line, code
    else:
        # Return None or raise an error if no match is found
        return None
    
def parse_preview_code(input_string):
    # like above, but works with any prefix of a valid code block, i.e. closing ``` is optional
    return parse_code(input_string + "```")
    
    # pattern = r'```\s*(INSERT_AT_LINE|REPLACE_AT_LINE)\((\d+)(?:,(\d+))?\)\n(.*?)\s*'

    # # Search for the pattern in the input string
    # match = re.search(pattern, input_string, re.DOTALL)

    # if match:
    #     # Extract the matched groups
    #     prefix = match.group(1)
    #     start_line = int(match.group(2))
    #     # For REPLACE_AT_LINE, extract the end line, otherwise None
    #     end_line = int(match.group(3)) if match.group(3) else None
    #     code = match.group(4).strip()
    #     return prefix, start_line, end_line, code
    # else:
    #     # Return None or raise an error if no match is found
    #     return None

async def prompt_stream(messages: list, prompt: str, state: UserProject):
    tools, func_lookup = state.register_all_tools()
    messages.append({"role": "user", "content": prompt})
    
    # keep calling the completion endpoint until there are no more tool calls
    for i in range(MAX_CALLS_PER_PROMPT):
        completion = await client.chat.completions.create(
            model="gpt-4-1106-preview",
            messages=[{"role": "system", "content": with_latest_state(state)}] + messages,
            tools=tools,
            tool_choice="auto",
            temperature=0.0,
        )
        new_msg = completion.choices[0].message
        messages.append(new_msg)
        if new_msg.content: 
            if parse_code(new_msg.content):
                f, s, e, code = parse_code(new_msg.content)
                if f=="INSERT_AT_LINE":
                    await state.insert_lines(s, code)
                    yield (f"Inserted at line {s}: {code}")
                elif f=="REPLACE_AT_LINE":
                    await state.replace_lines(s, e, code)
                    yield (f"Replaced lines {s} to {e} with {code}")
            else:
                yield (new_msg)
        if new_msg.tool_calls:
            for tool_call in new_msg.tool_calls:
                f = tool_call.function
                yield (f"Calling function: {f.name}, args = {f.arguments}")
                ret_val = await call_requested_function(f, func_lookup)
                yield (f"Returned: {ret_val}")

                # insert the return value into the message
                messages.append({"role": "tool", "content": ret_val, "tool_call_id": tool_call.id})
        else:
            break





async def prompt_stream_chunk(messages: list, prompt: str, state: UserProject):
    tools, func_lookup = state.register_all_tools()
    messages.append({"role": "user", "content": prompt})
    print(f"PROMPT STARTED, MESSAGES: {messages}")
    
    # keep calling the completion endpoint until there are no more tool calls
    for i in range(MAX_CALLS_PER_PROMPT):
        print(f"CALLING COMPLETION {i}")
        stream = await client.chat.completions.create(
            model="gpt-4-1106-preview",
            messages=[{"role": "system", "content": with_latest_state(state)}] + messages,
            tools=tools,
            tool_choice="auto",
            temperature=0.0,
            stream=True
        )

        # we're completing the response chunk by chunk, and pass a preview to the frontend/consumer
        print(f"STREAM STARTED")
        i_think_this_msg_is_just_text = False
        async for partial_msg in chunk_stream(stream):
            print(f"stream")
            try:
                if len(partial_msg['content']) > 20:  # should be enough to tell if it's a parse code or not
                    if parse_preview_code(partial_msg['content']):
                        if i_think_this_msg_is_just_text:
                            # but it turns out it wasn't, so we "undo" the mistake by yielding an empty speech bubble to the frontend
                            yield SpeechBubble(speech_message="") # speech bubble empty

                        f, s, e, code = parse_preview_code(partial_msg['content'])
                        if f=="INSERT_AT_LINE":
                            file_content_preview = (await state.preview_insert_lines(s, code)) + "..."
                            yield EditFile(file_contents=file_content_preview) #TODO edit file command to frontend
                        elif f=="REPLACE_AT_LINE":
                            file_content_preview = (await state.preview_replace_lines(s, e, code)) + "..."
                            yield EditFile(file_contents=file_content_preview)
                    else:
                        # at this point, probably an actual message to show user
                        i_think_this_msg_is_just_text = True
                        yield SpeechBubble(speech_message=partial_msg['content'] + "...")
            except:
                # partial message can cause issues and stuff, not a big deal
                pass


        print(f"STREAM FINISHED")
        new_msg = partial_msg
        if 'tool_calls' in new_msg and len(new_msg['tool_calls']) == 0:
            # remove the empty tool_calls key
            del new_msg['tool_calls']
        # full response received, proceed as normal
        messages.append(new_msg)
        if new_msg['content']: 
            if parse_code(new_msg['content']):
                f, s, e, code = parse_code(new_msg['content'])
                if f=="INSERT_AT_LINE":
                    await state.insert_lines(s, code)
                    yield EditFile(file_contents=state.read_current_file())
                elif f=="REPLACE_AT_LINE":
                    await state.replace_lines(s, e, code)
                    yield EditFile(file_contents=state.read_current_file())
            else:
                yield SpeechBubble(speech_message=new_msg['content'])
        if 'tool_calls' in new_msg and new_msg['tool_calls']:
            for tool_call in new_msg['tool_calls']:
                print(f"CALLING FUNCTION {tool_call['function']['name']}")
                f = tool_call['function']
                # yield (f"Calling function: {f.name}, args = {f.arguments}")
                ret_val = await call_requested_function(f, func_lookup)
                # yield (f"Returned: {ret_val}")
                print(f"RETURNED: {ret_val}")
                if not ret_val.startswith("Error"):
                    a = json.loads(f['arguments'])
                    # generate commands
                    if f['name'] == "new_file":
                        yield NewFile(full_path=a['full_path'])
                        yield DirectoryUpdate(directories=recursive_convert(state.get_all_files()))
                    if f['name'] == "open_file":
                        yield OpenFile(full_path=a['full_path'])
                        yield EditFile(file_contents=state.read_current_file())
                    if f['name'] == "remove_lines":
                        yield EditFile(file_contents=state.read_current_file())
                    if f['name'] == "execute_command":
                        yield TerminalExecute()
                        yield TerminalUpdate(terminal_contents=ret_val)
                    # if f.name == "open_settings":
                    if f['name'] == "toggle_theme":
                        yield ToggleTheme()


                # insert the return value into the message
                messages.append({"role": "tool", "content": ret_val, "tool_call_id": tool_call['id']})
                
        else:
            print(f"GPT TURN FINISHED")
            break
        