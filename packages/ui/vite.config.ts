import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/components/*.tsx", "src/hooks/*.ts"],
    dts: {
      tsgo: true,
    },
  },
});
