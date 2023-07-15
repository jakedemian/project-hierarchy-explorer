import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getRootPath } from '../utils/getRootPath';
import { getDirectoryStructure } from '../utils/getDirectoryStructure';
import { getConfiguration } from '../utils/getConfiguration';
import { OUTPUT_FILE_NAME, SUCCESS_MESSAGE } from '../extension';

export async function generate() {
  const rootPath = getRootPath();

  if (!rootPath) {
    vscode.window.showErrorMessage('No root path found');
    return;
  }

  const ignorePatterns: string[] = getConfiguration('ignorePatterns') ?? [];
  const hierarchy = await getDirectoryStructure({
    dirPath: rootPath,
    ignorePatterns,
  });
  const result = path.basename(rootPath) + '\n' + hierarchy;

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
