import { path } from "./deps.ts";
import { helpText } from "./consts.ts";

const checkDir = async ([name, dirPath]: string[]): Promise<string | void> => {
  const p = path.resolve(Deno.cwd(), dirPath);
  const err = `${name} '${p} is not a directory.`;
  try {
    const s = await Deno.stat(p);
    if (!s.isDirectory) {
      return err;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return err;
    } else {
      // unexpected error, maybe permissions, pass it along
      // throw error;
      console.error(error);
    }
  }
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

export async function configMerge(
  inputDirectory: string,
  outputDirectory: string,
): Promise<void> {
  if (await checkDirs({ inputDirectory, outputDirectory })) {
    return;
  }
}
