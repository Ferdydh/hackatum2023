# Use a specific version of node
FROM node:20-slim AS base

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack to use pnpm
RUN corepack enable

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (or package-lock.json/yarn.lock)
COPY package.json pnpm-lock.yaml ./

# Install stage
FROM base AS install

# Install dependencies
# The cache mount is used to cache the pnpm store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Final stage
FROM base

# Copy installed node_modules from the install stage
COPY --from=install /app/node_modules /app/node_modules

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# The command to run your application
CMD [ "pnpm", "run", "dev" ]
