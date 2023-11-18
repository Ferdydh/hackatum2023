from dotenv import load_dotenv
load_dotenv(override=True)
from .utils import schema_to_openai_func, call_requested_function, register_tool, add_line_numbers
from .userproject import UserProject, FakeProject
from openai import OpenAI

client = OpenAI()

MAX_CALLS_PER_PROMPT = 100

SYSTEM = """
You are an AI copilot directly integrated into an IDE. You have full access to the interface of the IDE by calling the provided function tools, such as creating new files, opening files, writing to files, and executing commands on the integrated terminal.
When the user requests something, you should call a sequence of appropriate functions one by one to fulfill the request.
Inserting, removing and replacing lines are done in the file that was lastly opened by the open_file tool, therefore a file must always be opened before editing the text in it.
For example, when the user requests "make and run a simple hello world python program", you should call the following functions:
1. new_file(full_path="src/main.py")
2. open_file(full_path="src/main.py")
3. insert_lines(at=1, append_content="print('hello world')")
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
def prompt(messages: list, prompt: str, state: UserProject):
    tools, func_lookup = state.register_all_tools()
    messages.append({"role": "user", "content": prompt})
    
    # keep calling the completion endpoint until there are no more tool calls
    for i in range(MAX_CALLS_PER_PROMPT):
        completion = client.chat.completions.create(
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
                ret_val = call_requested_function(f, func_lookup)
                print(f"Returned: {ret_val}")

                # insert the return value into the message
                messages.append({"role": "tool", "content": ret_val, "tool_call_id": tool_call.id})
        else:
            return messages

