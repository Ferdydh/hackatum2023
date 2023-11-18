/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {

  eslint: {
    // Warning: Don't care about eslint
    ignoreDuringBuilds: true,
  },
};

export default config;
