import * as fs from 'fs';
import * as path from 'path';
import { getDirectoryStructure } from '../../utils/getDirectoryStructure';
import { use, expect } from 'chai';
import * as sinon from 'sinon';

import * as sinonChai from 'sinon-chai';
const dedent = require('dedent');

use(sinonChai);

suite('getDirectoryStructure', () => {
  let readdirStub: sinon.SinonStub;
  let statStub: sinon.SinonStub;

  const setupFileSystemMock = (fileSystemStructure: any) => {
    const stubs = new Map();

    const isFile = (structure: any) => typeof structure === 'string';

    const createStubs = (structure: any, parentPath = '') => {
      if (isFile(structure)) {
        stubs.set(parentPath, { isDirectory: () => false });
      } else {
        const children = Object.keys(structure);
        stubs.set(parentPath, { isDirectory: () => true, children });

        for (const [name, childStructure] of Object.entries(structure)) {
          createStubs(childStructure, path.join(parentPath, name));
        }
      }
    };

    createStubs(fileSystemStructure);

    readdirStub.callsFake((dirPath: string) => {
      const directory = stubs.get(dirPath);
      return Promise.resolve(directory ? directory.children : []);
    });

    statStub.callsFake((filePath: string) => {
      const item = stubs.get(filePath);
      if (item) {
        return Promise.resolve(item);
      } else {
        return Promise.reject(new Error(`Path ${filePath} does not exist`));
      }
    });
  };

  setup(() => {
    readdirStub = sinon.stub(fs.promises, 'readdir');
    statStub = sinon.stub(fs.promises, 'stat');
  });

  teardown(() => {
    readdirStub.restore();
    statStub.restore();
  });

  test('it should return the correct directory structure', async () => {
    setupFileSystemMock({
      root: {
        file1: '',
        file2: '',
        dir1: {
          file3: '',
        },
        dir2: {
          file4: '',
        },
      },
    });

    const result = (await getDirectoryStructure({ dirPath: 'root' })).trim();
    const expected = dedent`
      ├─ file1
      ├─ file2
      ├─ dir1
      │  └─ file3
      └─ dir2
         └─ file4`.trim();
    expect(result).to.equal(expected);
  });

  test('it should ignore files and directories matching ignore patterns', async () => {
    const fileSystemStructure = {
      root: {
        file1: '',
        ignoredFile: '',
        dir1: {
          file3: '',
        },
        ignoredDir: {
          file4: '',
        },
      },
    };
    setupFileSystemMock(fileSystemStructure);

    const result = (
      await getDirectoryStructure({
        dirPath: 'root',
        ignorePatterns: ['**/ignoredFile', '**/ignoredDir'],
      })
    ).trim();
    const expected = dedent`├─ file1
                            └─ dir1
                               └─ file3`.trim();
    expect(result).to.equal(expected);
  });

  test('it should print files and directories that fail to stat successfully', async () => {
    const fileSystemStructure = {
      root: {
        file1: '',
        inaccessibleFile: '',
        inaccessibleDir: {
          file3: '',
        },
        dir1: {
          file4: '',
        },
      },
    };

    setupFileSystemMock(fileSystemStructure);

    statStub.withArgs('root/inaccessibleDir').rejects(new Error('read error'));
    statStub.withArgs('root/inaccessibleFile').rejects(new Error('read error'));

    const result = (await getDirectoryStructure({ dirPath: 'root' })).trim();
    const expected = dedent`├─ file1
                            ├─ inaccessibleFile
                            ├─ inaccessibleDir
                            └─ dir1
                               └─ file4`.trim();
    expect(result).to.equal(expected);
  });

  test('it should skip reading contents of directories that fail to readdir', async () => {
    const fileSystemStructure = {
      root: {
        file1: '',
        file2: '',
        inaccessibleDir: {
          file3: '',
        },
        dir1: {
          file4: '',
        },
      },
    };

    setupFileSystemMock(fileSystemStructure);

    readdirStub
      .withArgs('root/inaccessibleDir')
      .rejects(new Error('read error'));

    const result = (await getDirectoryStructure({ dirPath: 'root' })).trim();
    const expected = dedent`├─ file1
                            ├─ file2
                            ├─ inaccessibleDir
                            └─ dir1
                               └─ file4`.trim();
    expect(result).to.equal(expected);
  });
});
