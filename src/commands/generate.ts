import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getRootPath } from '../utils/getRootPath';
import { getDirectoryStructure } from '../utils/getDirectoryStructure';
import { getConfiguration } from '../utils/getConfiguration';
import { OUTPUT_FILE_NAME, SUCCESS_MESSAGE } from '../extension';

type GenerateOptions = {
  relativePath?: string;
};

export async function generate(options: GenerateOptions = {}) {
  const { relativePath } = options;
  const rootPath = getRootPath();

  if (!rootPath) {
    vscode.window.showErrorMessage('No root path found');
    return;
  }

  const targetPath = relativePath
    ? path.join(rootPath, relativePath)
    : rootPath;
  const ignorePatterns: string[] = getConfiguration('ignorePatterns') ?? [];
  const hierarchy = await getDirectoryStructure({
    dirPath: targetPath,
    ignorePatterns,
  });
  const result = path.basename(targetPath) + '\n' + hierarchy;

  const outputsTo: string = getConfiguration('outputsTo') ?? 'file';

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

  let suppressNotification: boolean =
    getConfiguration('suppressNotification') ?? true;

  if (!suppressNotification) {
    vscode.window.showInformationMessage(SUCCESS_MESSAGE);
  }
}
