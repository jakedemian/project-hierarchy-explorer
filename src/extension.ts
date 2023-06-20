import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('project-hierarchy-explorer.testGenerate', () => {
        const filePath = path.join(vscode.workspace.rootPath!, 'test.txt');
        fs.writeFileSync(filePath, 'hello world!');
        vscode.window.showInformationMessage('Test file generated!');
    });

    context.subscriptions.push(disposable);
}