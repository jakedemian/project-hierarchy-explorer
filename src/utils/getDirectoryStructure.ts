import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Minimatch } from 'minimatch';

// TODO add fileIgnorePatterns config, maybe just use existing ignorePatterns config?
export function getDirectoryStructure(dirPath: string, prefix = ''): string {
  const entries: string[] = fs.readdirSync(dirPath); // TODO should this be synchronous?
  const ignorePatterns: string[] =
    vscode.workspace
      .getConfiguration('project-hierarchy-explorer')
      .get<string[]>('ignorePatterns') || [];

  let structure = '';
  const filteredDir = entries.filter(
    file => !ignorePatterns.some(pattern => new Minimatch(pattern).match(file))
  );

  filteredDir.forEach((file, index, array) => {
    const filePath = path.join(dirPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    const isLastInDirectory = index === array.length - 1;

    structure += prefix + (isLastInDirectory ? '└─ ' : '├─ ') + file + '\n';
    if (isDirectory) {
      structure += getDirectoryStructure(
        filePath,
        isLastInDirectory ? prefix + '   ' : prefix + '│  '
      );
    }
  });
  return structure;
}
