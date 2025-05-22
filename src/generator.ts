import { cp, rename, readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import path from "path";
import color from "picocolors";
import ora from "ora";

export async function generateProject(
  name: string,
  template: string,
  destination: string,
  extras: string[]
) {
  const spinner = ora("Copiando archivos base...").start();
  // Copiar archivos base excluyendo node_modules
  const baseFiles = await glob("**/*", {
    cwd: path.join(template, "project"),
    absolute: true,
    nodir: false,
    ignore: ["node_modules/**"],
  });
  for (const file of baseFiles) {
    const rel = path.relative(path.join(template, "project"), file);
    if (!rel.startsWith("node_modules")) {
      const dest = path.join(destination, rel);
      const stat = await import("fs/promises").then((fs) => fs.stat(file));
      if (stat.isDirectory()) {
        await import("fs/promises").then((fs) =>
          fs.mkdir(dest, { recursive: true })
        );
      } else {
        // Asegurar que el directorio padre existe antes de copiar
        await import("fs/promises").then((fs) =>
          fs.mkdir(path.dirname(dest), { recursive: true })
        );
        await import("fs/promises").then((fs) => fs.copyFile(file, dest));
      }
    }
  }
  spinner.text = "Agregando extras...";
  for await (const extra of extras) {
    const extraFiles = await glob("**/*", {
      cwd: path.join(template, "extras", extra),
      absolute: true,
      nodir: false,
      ignore: ["node_modules/**"],
    });
    for (const file of extraFiles) {
      const rel = path.relative(path.join(template, "extras", extra), file);
      if (!rel.startsWith("node_modules")) {
        const dest = path.join(destination, rel);
        const stat = await import("fs/promises").then((fs) => fs.stat(file));
        if (stat.isDirectory()) {
          await import("fs/promises").then((fs) =>
            fs.mkdir(dest, { recursive: true })
          );
        } else {
          // Asegurar que el directorio padre existe antes de copiar
          await import("fs/promises").then((fs) =>
            fs.mkdir(path.dirname(dest), { recursive: true })
          );
          await import("fs/promises").then((fs) => fs.copyFile(file, dest));
        }
      }
    }
  }
  spinner.text = "Renombrando archivos...";
  let files = await glob("**/*", {
    cwd: destination,
    absolute: true,
    nodir: true,
  });
  for (const file of files) {
    const base = path.basename(file);
    if (base.startsWith("%%")) {
      const renamed = path.join(path.dirname(file), base.slice(2));
      await rename(file, renamed);
    }
  }
  spinner.text = "Personalizando archivos...";
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
  spinner.succeed("Proyecto creado exitosamente");
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
