import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('project-hierarchy-explorer.generate', () => {
        const filePath = path.join(vscode.workspace.rootPath!, 'project-hierarchy.txt');
        const hierarchy = getDirectoryStructure(vscode.workspace.rootPath!);
        fs.writeFileSync(filePath, hierarchy);
        vscode.window.showInformationMessage('Success! Check project-hierarchy.txt in the root of your project');
    });

    context.subscriptions.push(disposable);
}

function getDirectoryStructure(dirPath: string, prefix = ''): string {
    const dir = fs.readdirSync(dirPath);
    let structure = '';
    for (const file of dir) {
        const filePath = path.join(dirPath, file);
        const isDir = fs.statSync(filePath).isDirectory();
        structure += prefix + (isDir ? '├─ ' : '└─ ') + file + '\n';
        if (isDir) {
            structure += getDirectoryStructure(filePath, prefix + '│  ');
        }
    }
    return structure;
}
