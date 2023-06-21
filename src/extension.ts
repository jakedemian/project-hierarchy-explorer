import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Minimatch } from 'minimatch';

const ROOT_PATH = vscode.workspace.rootPath;
const OUTPUT_FILE_NAME = 'project-hierarchy.txt'; // TODO will change to config

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generate',
    () => {
      const filePath = path.join(ROOT_PATH!, OUTPUT_FILE_NAME);
      const hierarchy =
        getParentDirectoryName() + '\n' + getDirectoryStructure(ROOT_PATH!);
      fs.writeFileSync(filePath, hierarchy);
      vscode.window.showInformationMessage(
        'Success! Check project-hierarchy.txt in the root of your project'
      );
    }
  );

  context.subscriptions.push(disposable);
}

// TODO add fileIgnorePatterns config, maybe just use existing ignorePatterns config?
function getDirectoryStructure(dirPath: string, prefix = ''): string {
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

function getParentDirectoryName(): string {
  const parentDirPath = path.join(ROOT_PATH!, '..');
  const parentDirEntries = fs.readdirSync(parentDirPath); // TODO should this be synchronous?

  const parentDirName = parentDirEntries.find(
    file => file === path.basename(ROOT_PATH!)
  );

  if (!parentDirName) {
    console.error('Parent directory not found');
    return 'Root Directory';
  }

  return parentDirName;
}
