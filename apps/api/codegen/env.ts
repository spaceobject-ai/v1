import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Load .dev.vars for local runs. CI provides these variables through the
// environment instead; loadEnvFile never overrides already-set variables.
const devVars = fileURLToPath(new URL("../.dev.vars", import.meta.url));
if (existsSync(devVars)) process.loadEnvFile(devVars);

export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value)
    throw new Error(
      `Missing environment variable ${name}. Set it in apps/api/.dev.vars or the CI environment.`,
    );
  return value;
}
