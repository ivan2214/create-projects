import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath } from "url";
import { TEMPLATES, EXTRAS } from "./templates";
import { generateProject } from "./generator";

export async function runCli() {
  const args = yargs(hideBin(process.argv)).options({
    name: { alias: "n", type: "string" },
    template: { alias: "t", type: "string" },
  });

  prompts.override(args.argv);

  const {
    _: [initialName],
  } = await args.argv;

  const project = await prompts([
    {
      type: "text",
      name: "name",
      message: "What is the name of your project?",
      initial: initialName || "appncy-project",
      validate: (value) =>
        value.match(/[^a-zA-Z0-9-_]+/g)
          ? "Only letters, numbers, dashes and underscores"
          : true,
    },
    {
      type: "select",
      name: "template",
      message: "Which template would you like to use?",
      choices: TEMPLATES,
    },
  ]);

  let extras: string[] = [];

  if (EXTRAS[project.template]) {
    const { extras: selected } = await prompts({
      type: "multiselect",
      name: "extras",
      message: "Which extras would you like to add?",
      choices: EXTRAS[project.template],
    });
    extras = selected;
  }

  const root = path.dirname(fileURLToPath(import.meta.url));
  const templateDir = path.join(root, "templates", project.template);
  const destination = path.join(process.cwd(), project.name);

  await generateProject(project.name, templateDir, destination, extras);
}
