import { cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	outDir: "dist",
	target: "node20",
	clean: true,
	splitting: false,
	sourcemap: true,
	shims: true,
	async onSuccess() {
		await cp(
			path.join(path.dirname(fileURLToPath(import.meta.url)), "templates"),
			path.join("dist", "templates"),
			{
				recursive: true,
			},
		);
	},
});
