import { defineConfig } from "tsup";

const prismaExternals = ["@prisma/client", /^\.prisma\/client/, "pg", "pg-native"];

const nodeBundle = {
  platform: "node" as const,
  target: "node20" as const,
  bundle: true,
  splitting: false,
  external: prismaExternals,
  /** Ship as CJS for Vercel; must inline better-auth — it only publishes ESM `.mjs` (require() fails if left external). */
  noExternal: ["better-auth"],
};

/**
 * Vercel: mentor-style flow uses `vercel.json` `builds` + `routes` so only this file
 * is the @vercel/node entry (avoids Vercel compiling `src/*.ts` → ESM `src/app.js`
 * that then gets require()'d and crashes).
 *
 * Do NOT use `--format esm` here: bundling Prisma into ESM breaks serverless (dynamic require("fs")).
 * Output must be CommonJS (`format: "cjs"`).
 */
export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    ...nodeBundle,
    outDir: "api",
    outExtension: () => ({ js: ".js" }),
    clean: true,
    /** No sourcemaps: Vercel file-tracing can pull `src/*.ts` into the lambda and emit ESM `src/*.js`, which then breaks under Node 22+ CJS interop (ERR_REQUIRE_CYCLE_MODULE). */
    sourcemap: false,
    minify: true,
  },
  {
    entry: ["src/server.ts"],
    format: ["cjs"],
    ...nodeBundle,
    outDir: "dist",
    outExtension: () => ({ js: ".js" }),
    clean: true,
    sourcemap: true,
  },
]);
