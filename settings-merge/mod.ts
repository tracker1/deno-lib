import { helpText } from "./feature/consts.ts";

import { isDirectory } from "../utils/is-directory.ts";

const checkDir = async ([name, dirPath]: string[]): Promise<string | void> => {
  if (await isDirectory(dirPath)) return;
  return `${name} '${dirPath} is not a directory.`;
};

const checkDirs = async (dirs: Record<string, string>): Promise<boolean> => {
  const errors = (await Promise.all(Object.entries(dirs).map(checkDir))).filter(
    (r) => r,
  );
  if (errors.length) {
    throw new Error(`\n${errors.join("\n")}\n${helpText}`);
  }
  return false;
};

/**
 * Process the input settings directory and output build to another path
 * @param {string} inputDirectory Path to the settings directory to process
 * @param {*} outputDirectory Path to output the transformed configuration
 * @return {Promise}
 */
export async function settingsMerge(
  inputDirectory: string,
  outputDirectory: string,
): Promise<void> {
  if (await checkDirs({ inputDirectory, outputDirectory })) {
    return;
  }
}
