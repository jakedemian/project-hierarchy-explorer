import * as fs from 'fs';
import * as path from 'path';
import { Minimatch } from 'minimatch';
import { getConfiguration } from './getConfiguration';

export async function getDirectoryStructure(
  dirPath: string,
  prefix = ''
): Promise<string> {
  let entries: string[];

  let structure = '';

  try {
    entries = await fs.promises.readdir(dirPath);
  } catch (err: any) {
    console.warn('Failed to read directory: ', err);
    return structure;
  }

  const ignorePatterns: string[] = getConfiguration('ignorePatterns') ?? [];
  const minimatches = ignorePatterns.map(pattern => new Minimatch(pattern));

  const filteredDir = entries.filter(
    file => !minimatches.some(minimatch => minimatch.match(file))
  );

  for (const [index, file] of filteredDir.entries()) {
    const filePath = path.join(dirPath, file);
    const isLastInDirectory = index === filteredDir.length - 1;

    let isDirectory: boolean;

    try {
      isDirectory = (await fs.promises.stat(filePath))?.isDirectory();
    } catch (err) {
      console.warn(`Failed to stat ${filePath}: ${err}`);
      isDirectory = false;
    }

    structure += prefix + (isLastInDirectory ? '└─ ' : '├─ ') + file + '\n';

    if (isDirectory) {
      structure += await getDirectoryStructure(
        filePath,
        isLastInDirectory ? prefix + '   ' : prefix + '│  '
      );
    }
  }
  return structure;
}
