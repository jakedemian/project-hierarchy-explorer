import * as fs from 'fs';
import * as path from 'path';
import { getRootPath } from './getRootPath';
import { DirectoryReadError } from '../errors/DirectoryReadError';

export async function getParentDirectoryName() {
  const ROOT_PATH = getRootPath();

  const parentDirPath = path.join(ROOT_PATH!, '..');

  let parentDirEntries: string[];
  try {
    parentDirEntries = await fs.promises.readdir(parentDirPath);
  } catch (err: any) {
    throw new DirectoryReadError(parentDirPath, err);
  }

  const parentDirName = parentDirEntries.find(
    file => file === path.basename(ROOT_PATH!)
  );

  if (!parentDirName) {
    console.error('Parent directory not found');
    return 'Root Directory';
  }

  return parentDirName;
}
