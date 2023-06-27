import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getRootPath } from './utils/getRootPath';
import { getDirectoryStructure } from './utils/getDirectoryStructure';
import { getConfiguration } from './utils/getConfiguration';

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
      const result = path.basename(rootPath) + '\n' + hierarchy;

      const outputsTo: string = getConfiguration('outputsTo') || 'file';

      if (outputsTo === 'file' || outputsTo === 'both') {
        const outputFilePath = path.join(rootPath, OUTPUT_FILE_NAME);
        fs.writeFileSync(outputFilePath, result);

        vscode.workspace.openTextDocument(outputFilePath).then(doc => {
          vscode.window.showTextDocument(doc);
        });
      }

      if (outputsTo === 'console' || outputsTo === 'both') {
        const outputChannel = vscode.window.createOutputChannel(
          'Project Hierarchy Explorer'
        );
        outputChannel.append(result);
        outputChannel.show();
      }
    }
  );

  context.subscriptions.push(disposable);
}
