import * as fs from 'fs';
import * as path from 'path';
import { getRootPath } from './getRootPath';

const ROOT_PATH = getRootPath();

export function getParentDirectoryName(): string {
  const parentDirPath = path.join(ROOT_PATH!, '..');
  const parentDirEntries = fs.readdirSync(parentDirPath); // TODO should this be synchronous?

  const parentDirName = parentDirEntries.find(
    file => file === path.basename(ROOT_PATH!)
  );

  if (!parentDirName) {
    console.error('Parent directory not found');
    return 'Root Directory';
  }

  return parentDirName;
}
