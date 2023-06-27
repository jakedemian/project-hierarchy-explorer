import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getRootPath } from './utils/getRootPath';
import { getParentDirectoryName } from './utils/getParentDirectoryName';
import { getDirectoryStructure } from './utils/getDirectoryStructure';

export const OUTPUT_FILE_NAME = 'project-hierarchy.txt';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generate',
    async () => {
      const rootPath = getRootPath();

      if (!rootPath) {
        vscode.window.showErrorMessage('No root path found');
        return;
      }

      const hierarchy = await getDirectoryStructure(rootPath);
      const output = (await getParentDirectoryName()) + '\n' + hierarchy;

      const outputFilePath = path.join(rootPath, OUTPUT_FILE_NAME);
      fs.writeFileSync(outputFilePath, output);

      vscode.window.showInformationMessage(
        'Success! Check project-hierarchy.txt in the root of your project'
      );
    }
  );

  context.subscriptions.push(disposable);
}
