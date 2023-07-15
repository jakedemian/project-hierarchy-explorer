import * as vscode from 'vscode';
import { generate } from './commands/generate';

export const OUTPUT_FILE_NAME = 'project-hierarchy.txt';
export const SUCCESS_MESSAGE = 'Success!';

export function activate(context: vscode.ExtensionContext) {
  let _generate = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generate',
    async () => generate()
  );

  let _generatePartial = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generatePartial',
    async () => {
      const relativePath = await vscode.window.showInputBox({
        placeHolder: 'Enter relative path to root directory',
      });

      if (!relativePath) {
        return;
      }

      generate({ relativePath });
    }
  );

  context.subscriptions.push(_generate, _generatePartial);
}
