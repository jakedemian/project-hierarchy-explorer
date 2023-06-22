import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { getDirectoryStructure } from '../../utils/getDirectoryStructure';
import { use, expect } from 'chai';
import * as sinon from 'sinon';

import * as sinonChai from 'sinon-chai';
import { DirectoryReadError } from '../../errors/DirectoryReadError';
import * as config from '../../utils/config';
const dedent = require('dedent');

use(sinonChai);

suite('getDirectoryStructure Test Suite', () => {
  let readdirStub: sinon.SinonStub;
  let statStub: sinon.SinonStub;
  let getConfigurationStub: sinon.SinonStub;

  // TODO move into a separate file
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

  /////////////////////////////

  setup(() => {
    readdirStub = sinon.stub(fs.promises, 'readdir');
    statStub = sinon.stub(fs.promises, 'stat');
    getConfigurationStub = sinon.stub(config, 'getConfiguration');
  });

  teardown(() => {
    readdirStub.restore();
    statStub.restore();
    getConfigurationStub.restore();
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

    const result = (await getDirectoryStructure('root')).trim();
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

    getConfigurationStub.returns(['**/ignoredFile', '**/ignoredDir']);

    const result = (await getDirectoryStructure('root')).trim();
    const expected = dedent`├─ file1
                            └─ dir1
                               └─ file3`.trim();
    expect(result).to.equal(expected);
  });

  test('it should throw DirectoryReadError if cannot read directory', async () => {
    readdirStub.rejects(new Error('Cannot read directory'));

    try {
      await getDirectoryStructure('root');
      assert.fail('Expected DirectoryReadError was not thrown');
    } catch (error: any) {
      expect(error).to.be.instanceOf(DirectoryReadError);
      expect(error.message).to.contain('Cannot read directory');
    }
  });
});
