import * as vscode from 'vscode';
import { generate } from './commands/generate';

export const OUTPUT_FILE_NAME = 'project-hierarchy.txt';
export const SUCCESS_MESSAGE = 'Success!';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'project-hierarchy-explorer.generate',
    async () => generate()
  );

  context.subscriptions.push(disposable);
}
