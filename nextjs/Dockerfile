FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS install
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile  
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install @radix-ui/react-alert-dialog

FROM base
COPY --from=install /app/node_modules /app/node_modules
EXPOSE 3000
CMD [ "pnpm", "run", "dev" ]