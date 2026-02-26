/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

import checker from "vite-plugin-checker";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [
        viteTsconfigPaths(),
        checker({
            typescript: true,
            overlay: { position: "tr" },
            enableBuild: false,
        }),
    ],
    build: {
        lib: {
            formats: ["es", "cjs"],
            entry: {
                index: "src/index.ts",
            },
            name: "fetch-incoming-message",
        },
        outDir: "lib",
        emptyOutDir: false,
        sourcemap: true,
    },
    test: {
        globals: true,
        projects: [
            {
                test: {
                    name: "node",
                    environment: "node",
                    include: [
                        "./src/*.spec.ts",
                        "./src/*.spec-d.ts",
                        "./src/**/*.spec.ts",
                        "./src/**/*.spec-d.ts",
                    ],
                    globals: true,
                },
            },
        ],
    },
});
