import { cp, rename, readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import path from "path";
import color from "picocolors";

export async function generateProject(
  name: string,
  template: string,
  destination: string,
  extras: string[]
) {
  await cp(path.join(template, "project"), destination, { recursive: true });

  for await (const extra of extras) {
    await cp(path.join(template, "extras", extra), destination, {
      recursive: true,
    });
  }

  let files = await glob("**/*", {
    cwd: destination,
    absolute: true,
    nodir: true,
  });

  // Rename files starting with %%
  for (const file of files) {
    const base = path.basename(file);
    if (base.startsWith("%%")) {
      const renamed = path.join(path.dirname(file), base.slice(2));
      await rename(file, renamed);
    }
  }

  // Replace {{name}} tokens
  files = await glob("**/*", {
    cwd: destination,
    absolute: true,
    nodir: true,
  });

  for (const file of files) {
    const data = await readFile(file, "utf8");
    const replaced = data.replace(/{{name}}/g, name);
    await writeFile(file, replaced);
  }

  // Final logs
  console.log("\n✨ Project created ✨\n");
  console.log(`${color.green("cd")} ${name}`);
  console.log(`${color.green("pnpm")} install`);
  console.log(`${color.green("pnpm")} dev`);

  if (extras.length) {
    console.log(
      `\nCheck out ${color.italic(
        extras.map((e) => `${e.toUpperCase()}.md`).join(", ")
      )}`
    );
  }
}
