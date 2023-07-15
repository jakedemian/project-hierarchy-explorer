import * as vscode from 'vscode';
import { generate } from './commands/generate';

export const OUTPUT_FILE_NAME = 'project-hierarchy.txt';
export const SUCCESS_MESSAGE = 'Success!';

export function activate(context: vscode.ExtensionContext) {
  let generateCommand = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generate',
    async () => generate()
  );

  let generateSubtreeCommand = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generateSubtree',
    async (relativePath?: string) => {
      let _relativePath =
        relativePath ??
        (await vscode.window.showInputBox({
          placeHolder: 'Enter relative path to root directory',
        }));

      if (!_relativePath) {
        return;
      }

      generate({ relativePath: _relativePath });
    }
  );

  context.subscriptions.push(generateCommand, generateSubtreeCommand);
}
