# Backend

## Running

Build and run the docker container with hot reload enabled:
    
```bash
docker build -t ducky . && docker run -p 8002:8002 -v $(pwd)/app:/code/app ducky
```

## During Development

Whenever you need to install a new package, do

```bash
pip install [package]
pip list --format=freeze > requirements.txt
```
