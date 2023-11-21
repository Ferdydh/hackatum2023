# Backend

## Setting up API Key

Copy the `.env.example` file and rename it to `.env`. Then, set your OpenAI API key there.

## Running

Make sure you `cd python` before running any of these commands.

During normal use, don't do hot reload:
```bash
docker build -t ducky . && docker run -p 8002:8002 -v $(pwd)/../../project:/project ducky
```

During development, build and run the docker container with hot reload enabled (note that you need to change the CMD line in the dockerfile to enable hot reload):
    
```bash
docker build -t ducky . && docker run -p 8002:8002 -v $(pwd)/app:/code/app -v $(pwd)/../../project:/project ducky
```

## During Development

Whenever you need to install a new package, do

```bash
pip install [package]
pip list --format=freeze > requirements.txt
```
