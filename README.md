# Ducky

## Running

Docker compose should be working:
```bash
docker-compose up
```
...but right now it doesn't on my machine. So, you can run the server and the client separately:

```bash
cd nextjs
pnpm i
pnpm run dev
```

In a new terminal:
```bash
cd python
docker build -t ducky .
docker run -p 8002:8002 -v $(pwd)/../../project:/project ducky
```

If you open http://localhost:3000, you should be able to use the IDE.