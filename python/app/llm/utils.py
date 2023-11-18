import json
import jsonref
from typing import Type
from pydantic import BaseModel
import tiktoken

tokenizer = tiktoken.get_encoding("cl100k_base")

def count_tokens(text: str) -> int:
    return len(tokenizer.encode(text))


def call_requested_function(call_request, func_lookup):
    # parse function call
    func_name = call_request['name']
    arguments = call_request['arguments']

    if func_name not in func_lookup:
        return f"Error: Function {func_name} does not exist."
    try:
        params = json.loads(arguments)
    except Exception as e:    
        return f"Error: Failed to parse arguments, make sure your arguments is a valid JSON object: {e}"

    # call function
    try:
        return func_lookup[func_name](**params)
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