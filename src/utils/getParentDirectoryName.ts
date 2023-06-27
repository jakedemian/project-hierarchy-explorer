import * as fs from 'fs';
import * as path from 'path';
import { getRootPath } from './getRootPath';
import { DirectoryReadError } from '../errors/DirectoryReadError';

export async function getParentDirectoryName() {
  const rootPath = getRootPath();

  // pretty sure this is really stupid... just grab the last directory name from rootPath....
  const parentDirPath = path.join(rootPath!, '..');

  let parentDirEntries: string[];
  try {
    parentDirEntries = await fs.promises.readdir(parentDirPath);
  } catch (err: any) {
    throw new DirectoryReadError(parentDirPath, err);
  }

  const parentDirName = parentDirEntries.find(
    file => file === path.basename(rootPath!)
  );

  if (!parentDirName) {
    console.error('Parent directory not found');
    return 'Root Directory';
  }

  return parentDirName;
}
