import * as fs from 'fs';
import * as path from 'path';
import { Minimatch } from 'minimatch';
import { getConfiguration } from './getConfiguration';
import { DirectoryReadError } from '../errors/DirectoryReadError';

export async function getDirectoryStructure(
  dirPath: string,
  prefix = ''
): Promise<string> {
  let entries: string[];
  try {
    entries = await fs.promises.readdir(dirPath);
  } catch (err: any) {
    throw new DirectoryReadError(dirPath, err);
  }

  const ignorePatterns: string[] = getConfiguration('ignorePatterns') || [];
  const minimatches = ignorePatterns.map(pattern => new Minimatch(pattern));

  let structure = '';
  const filteredDir = entries.filter(
    file => !minimatches.some(minimatch => minimatch.match(file))
  );

  for (const [index, file] of filteredDir.entries()) {
    const filePath = path.join(dirPath, file);

    let isDirectory: boolean;
    try {
      isDirectory = (await fs.promises.stat(filePath)).isDirectory();
    } catch (err) {
      throw new Error(`Failed to stat ${filePath}: ${err}`);
    }

    const isLastInDirectory = index === filteredDir.length - 1;

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
