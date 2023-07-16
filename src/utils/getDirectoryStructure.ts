import * as fs from 'fs';
import * as path from 'path';
import { Minimatch } from 'minimatch';
import { getRootPath } from './getRootPath';

interface Options {
  dirPath: string;
  ignorePatterns?: string[];
  prefix?: string;
}

export async function getDirectoryStructure(options: Options): Promise<string> {
  const { dirPath = getRootPath() as string, ignorePatterns, prefix } = options;

  let entries: string[];
  let structure = '';

  try {
    entries = await fs.promises.readdir(dirPath);
  } catch (err: any) {
    console.warn('Failed to read directory: ', err);
    return structure;
  }

  const minimatches = ignorePatterns
    ? ignorePatterns.map(pattern => new Minimatch(pattern))
    : [];
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

    const linePrefix = prefix ? prefix : '';
    structure += linePrefix + (isLastInDirectory ? '└─ ' : '├─ ') + file + '\n';

    if (isDirectory) {
      structure += await getDirectoryStructure({
        dirPath: filePath,
        ignorePatterns: ignorePatterns,
        prefix: isLastInDirectory ? linePrefix + '   ' : linePrefix + '│  ',
      });
    }
  }
  return structure;
}
