import json
import jsonref
from typing import Type
from pydantic import BaseModel
import tiktoken

tokenizer = tiktoken.get_encoding("cl100k_base")

def count_tokens(text: str) -> int:
    return len(tokenizer.encode(text))


async def call_requested_function(call_request, func_lookup):
    # parse function call
    func_name = call_request.name
    arguments = call_request.arguments

    if func_name not in func_lookup:
        return f"Error: Function {func_name} does not exist."
    try:
        params = json.loads(arguments)
    except Exception as e:    
        return f"Error: Failed to parse arguments, make sure your arguments is a valid JSON object: {e}"

    # call function
    try:
        return await func_lookup[func_name](**params)
    except Exception as e:
        return f"Error: {e}"
    

# Pydantic -> OpenAI function schema
def remove_title(d) -> dict | list:
    if isinstance(d, dict):
        if 'title' in d and type(d['title']) == str:
            d.pop('title')
        for v in d.values():
            remove_title(v)
    elif isinstance(d, list):
        for v in d:
            remove_title(v)
    return d

def to_nested_schema(model: Type[BaseModel], no_title=True) -> dict:
    '''nested json schema rather than refs'''
    schema = jsonref.loads(json.dumps(model.model_json_schema()), proxies=False)
    if 'definitions' in schema:
        schema.pop('definitions')
    if '$defs' in schema:
        schema.pop('$defs')
    if no_title:
        remove_title(schema)
    return schema

def schema_to_openai_func(schema: dict | Type[BaseModel], nested=True) -> dict:
    if not isinstance(schema, dict) and issubclass(schema, BaseModel):
        if nested:
            schema = to_nested_schema(schema, no_title=False)
        else:
            schema = schema.model_json_schema()

    # Convert properties
    remove_title(schema['properties'])

    # Construct the OpenAI function schema format
    return {
        'type': 'function',
        "function": {
        'name': schema.get('title', ''),
        'description': schema.get('description', ''),
        'parameters': {
            'type': 'object',
            'properties': schema['properties'],
            'required': schema.get('required', [])
        }}
    }

def register_tool(model_func):
    tools = [
        schema_to_openai_func(model)
        for model, _ in model_func
    ]
    
    func_lookup = {
        model.__name__: func
        for model, func in model_func
    }
    return tools, func_lookup

def add_line_numbers(code):
    # Split the code into lines
    lines = code.split('\n')
    
    # Add line numbers to each line
    numbered_lines = [f"{i + 1}|{line}" for i, line in enumerate(lines)]
    
    # Join the lines back into a single string
    return '\n'.join(numbered_lines)

async def chunk_stream(stream):
    message = {
    'role': 'assistant',
    'content': '',
    'tool_calls': []
    }

    async for chunk in stream:
        delta = chunk.choices[0].delta
        # Handle role updates
        if delta.role:
            message['role'] = delta.role
        
        # Handle content updates
        if delta.content:
            message['content'] += delta.content

        # Handle tool calls
        if delta.tool_calls:
            for tool_call in delta.tool_calls:
                call_index = tool_call.index
                if len(message['tool_calls']) == call_index:
                    # new tool call started, so add a new empty object to the tool_calls list
                    message['tool_calls'].append({'id': None, 'type': 'function', 'function': {'name': '', 'arguments': ''}})
                if tool_call.id:
                    message['tool_calls'][call_index]['id'] = tool_call.id
                if tool_call.type:
                    message['tool_calls'][call_index]['type'] = tool_call.type
                if tool_call.function.name:
                    message['tool_calls'][call_index]['function']['name'] = tool_call.function.name
                if tool_call.function.arguments:
                    message['tool_calls'][call_index]['function']['arguments'] += tool_call.function.arguments
        yield message