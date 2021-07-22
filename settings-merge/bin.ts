#!/usr/bin/env -S deno run --allow-read=./ --allow-write=./ --

import { parseFlags } from "../deps.ts";

import { helpText } from "./feature/consts.ts";
import { settingsMerge } from "./mod.ts";

async function main(skip: boolean): Promise<void> {
  if (skip) return;

  const argv = parseFlags(Deno.args);

  switch (true) {
    case argv.help:
    case argv["?"]:
    case argv._.length != 2:
      console.log(helpText);
      return;
  }

  const [inputDirectory, outputDirectory]: any = argv._;
  console.log(`PROCESSING: ${inputDirectory} ${outputDirectory}`);
  await settingsMerge(inputDirectory, outputDirectory);
}

main(!import.meta.main).catch((error) => {
  console.error(error);
  Deno.exit(1);
});
