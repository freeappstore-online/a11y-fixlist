import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/services/scanner.ts",
        "src/services/report.ts",
        "src/services/rules/**/*.ts"
      ],
      exclude: [
        "src/**/*.test.ts"
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    }
  }
});