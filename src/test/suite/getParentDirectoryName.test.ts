import * as fs from 'fs';
import * as path from 'path';
import { use, expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as getRootPathModule from '../../utils/getRootPath';
import { getParentDirectoryName } from '../../utils/getParentDirectoryName';

use(sinonChai);

suite('getParentDirectoryName', () => {
  let readdirStub: sinon.SinonStub;
  let pathStub: sinon.SinonStub;
  const FAKE_ROOT_PATH = '/home/username/Projects/project3';
  const CORRECT_PARENT_DIRECTORY_NAME = 'project3';

  setup(() => {
    readdirStub = sinon.stub(fs.promises, 'readdir');
    pathStub = sinon.stub(path, 'join');

    sinon.stub(getRootPathModule, 'getRootPath').callsFake(() => {
      return `${FAKE_ROOT_PATH}/${CORRECT_PARENT_DIRECTORY_NAME}`;
    });
  });

  teardown(() => {
    readdirStub.restore();
  });

  test('it should return the correct directory structure', async () => {
    pathStub.callsFake((...args: string[]) => {
      return args.join('/home/username/Projects');
    });

    readdirStub.callsFake(() => {
      return Promise.resolve(['project1', 'project2', 'project3', 'project4']);
    });

    const result = (await getParentDirectoryName()).trim();
    expect(result).to.equal(CORRECT_PARENT_DIRECTORY_NAME);
  });

  // test('it should ignore files and directories matching ignore patterns', async () => {
  //   const fileSystemStructure = {
  //     root: {
  //       file1: '',
  //       ignoredFile: '',
  //       dir1: {
  //         file3: '',
  //       },
  //       ignoredDir: {
  //         file4: '',
  //       },
  //     },
  //   };
  //   setupFileSystemMock(fileSystemStructure);

  //   getConfigurationStub.returns(['**/ignoredFile', '**/ignoredDir']);

  //   const result = (await getDirectoryStructure('root')).trim();
  //   const expected = dedent`├─ file1
  //                           └─ dir1
  //                              └─ file3`.trim();
  //   expect(result).to.equal(expected);
  // });

  // test('it should throw DirectoryReadError if cannot read directory', async () => {
  //   readdirStub.rejects(new Error('Cannot read directory'));

  //   try {
  //     await getDirectoryStructure('root');
  //     assert.fail('Expected DirectoryReadError was not thrown');
  //   } catch (error: any) {
  //     expect(error).to.be.instanceOf(DirectoryReadError);
  //     expect(error.message).to.contain('Cannot read directory');
  //   }
  // });
});
