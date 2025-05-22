import { glob } from "glob";
import path from "node:path";
import color from "picocolors";
import ora from "ora";

async function isDirectory(file: string): Promise<boolean> {
  const fs = await import("node:fs/promises");
  const stat = await fs.stat(file);
  return stat.isDirectory();
}

async function ensureDir(dir: string) {
  await import("node:fs/promises").then((fs) =>
    fs.mkdir(dir, { recursive: true })
  );
}

async function copyFiles(
  srcDir: string,
  destDir: string,
  variables: Record<string, string> = {}
) {
  const files = await glob("**/*", {
    cwd: srcDir,
    absolute: true,
    nodir: false,
    ignore: ["node_modules/**"],
  });
  for (const file of files) {
    const rel = path.relative(srcDir, file);
    if (!rel.startsWith("node_modules")) {
      const dest = path.join(destDir, rel);
      if (await isDirectory(file)) {
        await ensureDir(dest);
      } else {
        await ensureDir(path.dirname(dest));
        let data = await import("node:fs/promises").then((fs) =>
          fs.readFile(file, "utf8")
        );
        for (const [key, value] of Object.entries(variables)) {
          data = data.replace(new RegExp(`{{${key}}}`, "g"), value);
        }
        await import("node:fs/promises").then((fs) => fs.writeFile(dest, data));
      }
    }
  }
}

export async function generateProject(
  name: string,
  template: string,
  destination: string,
  extras: string[],
  variables: Record<string, string> = {},
  packageManager = "pnpm"
) {
  const spinner = ora("Copiando archivos base...").start();
  try {
    await copyFiles(path.join(template, "project"), destination, {
      name,
      ...variables,
    });
    spinner.text = "Agregando extras...";
    for await (const extra of extras) {
      await copyFiles(path.join(template, "extras", extra), destination, {
        name,
        ...variables,
      });
    }
    spinner.text = "Renombrando archivos...";
    const files = await glob("**/*", {
      cwd: destination,
      absolute: true,
      nodir: true,
    });
    for (const file of files) {
      const base = path.basename(file);
      if (base.startsWith("%%")) {
        const renamed = path.join(path.dirname(file), base.slice(2));
        await import("node:fs/promises").then((fs) => fs.rename(file, renamed));
      }
    }
    spinner.succeed("Proyecto creado exitosamente");
    console.log("\n✨ Project created ✨\n");
    console.log(`${color.green("cd")} ${name}`);
    console.log(`${color.green(packageManager)} install`);
    console.log(`${color.green(packageManager)} dev`);
    if (extras.length) {
      console.log(
        `\nCheck out ${color.italic(
          extras.map((e) => `${e.toUpperCase()}.md`).join(", ")
        )}`
      );
    }
  } catch (e) {
    spinner.fail("Error al crear el proyecto");
    console.error(e);
    throw e;
  }
}
