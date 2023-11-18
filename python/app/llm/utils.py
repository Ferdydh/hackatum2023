import json
import jsonref
from typing import Type
from pydantic import BaseModel
import tiktoken

tokenizer = tiktoken.get_encoding("cl100k_base")

def count_tokens(text: str) -> int:
    return len(tokenizer.encode(text))

# recursively remove 'title' keys from schema
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
        'name': schema.get('title', ''),
        'description': schema.get('description', ''),
        'parameters': {
            'type': 'object',
            'properties': schema['properties'],
            'required': schema.get('required', [])
        }
    }