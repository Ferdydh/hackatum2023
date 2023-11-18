# Backend

## Running

Build the docker image:
    
```bash
docker build -t ducky .
```

Now run it, mounting the app directory to the container to enable hot reload:

```bash
docker run -p 8002:8002 -v $(pwd)/app:/code/app ducky
```

