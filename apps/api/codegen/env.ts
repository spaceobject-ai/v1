import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Load .dev.vars for local runs. CI provides these variables through the
// environment instead; loadEnvFile never overrides already-set variables.
const devVars = fileURLToPath(new URL("../.dev.vars", import.meta.url));
if (existsSync(devVars)) process.loadEnvFile(devVars);

// The subgraph URLs are not secrets; fall back to the values committed in
// wrangler.jsonc so only THE_GRAPH_SUBGRAPH_API_KEY must come from the
// environment. Strips line comments and trailing commas before parsing.
const wranglerVars: Record<string, string> = JSON.parse(
  readFileSync(fileURLToPath(new URL("../wrangler.jsonc", import.meta.url)), "utf8")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/,(\s*[}\]])/g, "$1"),
).vars;

export function requireEnv(name: string) {
  const value = process.env[name] || wranglerVars[name];
  if (!value)
    throw new Error(
      `Missing environment variable ${name}. Set it in apps/api/.dev.vars or the CI environment.`,
    );
  return value;
}
