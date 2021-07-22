/**
 * Takes input target data and outputs it to a given path
 * @param targets Input target data
 * @param outputDirectory Path to output to
 */
async function processOutput(
  targets: any,
  outputDirectory: string,
): Promise<void> {
  // TODO:
  console.log(`Processing output to: ${outputDirectory}`);
  console.dir({ targets });
}
