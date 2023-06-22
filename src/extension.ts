import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getRootPath } from './utils/getRootPath';
import { getParentDirectoryName } from './utils/getParentDirectoryName';
import { getDirectoryStructure } from './utils/getDirectoryStructure';

const ROOT_PATH = getRootPath();
const OUTPUT_FILE_NAME = 'project-hierarchy.txt'; // TODO will change to config

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generate',
    async () => {
      const filePath = path.join(ROOT_PATH!, OUTPUT_FILE_NAME);
      const hierarchy = await getDirectoryStructure(ROOT_PATH!);
      const output = getParentDirectoryName() + '\n' + hierarchy;

      fs.writeFileSync(filePath, output);
      vscode.window.showInformationMessage(
        'Success! Check project-hierarchy.txt in the root of your project'
      );
    }
  );

  context.subscriptions.push(disposable);
}
