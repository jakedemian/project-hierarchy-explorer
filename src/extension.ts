import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Minimatch } from 'minimatch';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('project-hierarchy-explorer.generate', () => {
        const filePath = path.join(vscode.workspace.rootPath!, 'project-hierarchy.txt');
        const hierarchy = getProjectName() + '\n' + getDirectoryStructure(vscode.workspace.rootPath!);
        fs.writeFileSync(filePath, hierarchy);
        vscode.window.showInformationMessage('Success! Check project-hierarchy.txt in the root of your project');
    });

    context.subscriptions.push(disposable);
}

function getProjectName(): string {
    const dir = fs.readdirSync(vscode.workspace.rootPath!);
    const packageJson = dir.find((file) => file === 'package.json');
    if (packageJson) {
        const packageJsonPath = path.join(vscode.workspace.rootPath!, packageJson);
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJsonParsed = JSON.parse(packageJsonContent);
        return packageJsonParsed.name;
    }
    return "Project";
}

function getDirectoryStructure(dirPath: string, prefix = ''): string {
    const dir = fs.readdirSync(dirPath);
    const ignorePatterns = vscode.workspace.getConfiguration('project-hierarchy-explorer').get<string[]>('ignorePatterns') || [];
    let structure = '';
    const filteredDir = dir.filter(file => !ignorePatterns.some(pattern => new Minimatch(pattern).match(file)));
    filteredDir.forEach((file, index, array) => {
        const filePath = path.join(dirPath, file);
        const isDir = fs.statSync(filePath).isDirectory();
        const isLast = index === array.length - 1;
        structure += prefix + (isLast ? '└─ ' : '├─ ') + file + '\n';
        if (isDir) {
            structure += getDirectoryStructure(filePath, isLast ? prefix + '   ' : prefix + '│  ');
        }
    });
    return structure;
}

