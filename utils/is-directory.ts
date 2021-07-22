import { resolve } from "https://deno.land/std@0.102.0/path/mod.ts";

export async function isDirectory(directoryPath: string): Promise<boolean> {
  const p = resolve(Deno.cwd(), directoryPath);
  try {
    const s = await Deno.stat(p);
    return s.isDirectory;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    }

    // unexpected error, maybe permissions, pass it along
    // throw error;
    throw error;
  }
}
