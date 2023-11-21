# Ducky

## Initial Setup
Set up your OpenAI API key in the `python` folder, by copying the .env.example file and renamining it to .env, and adding your API key to the file.

## Running

Docker compose should be working:
```bash
docker-compose up
```

Just in case it doesn't, you can run the services individually.

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