export class DirectoryReadError extends Error {
  constructor(dirPath: string, originalError: Error) {
    super(`Failed to read directory ${dirPath}: ${originalError.message}`);
    this.name = 'DirectoryReadError';
  }
}
