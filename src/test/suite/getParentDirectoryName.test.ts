import * as fs from 'fs';
import * as path from 'path';
import { use, expect, assert } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as getRootPathModule from '../../utils/getRootPath';
import { getParentDirectoryName } from '../../utils/getParentDirectoryName';
import { DirectoryReadError } from '../../errors/DirectoryReadError';

use(sinonChai);

suite('getParentDirectoryName', () => {
  let readdirStub: sinon.SinonStub;
  let pathStub: sinon.SinonStub;
  let getRootPathStub: sinon.SinonStub;
  const FAKE_ROOT_PATH = '/home/fake/Projects';
  const FAKE_PARENT_DIRECTORY_NAME = 'project3';

  setup(() => {
    readdirStub = sinon.stub(fs.promises, 'readdir');
    pathStub = sinon.stub(path, 'join');

    getRootPathStub = sinon
      .stub(getRootPathModule, 'getRootPath')
      .callsFake(() => {
        return `${FAKE_ROOT_PATH}/${FAKE_PARENT_DIRECTORY_NAME}`;
      });
  });

  teardown(() => {
    pathStub.restore();
    readdirStub.restore();
    getRootPathStub.restore();
  });

  test('it should return the correct root directory name', async () => {
    pathStub.callsFake((...args: string[]) => {
      return args.join(FAKE_ROOT_PATH);
    });

    readdirStub.callsFake(() => {
      return Promise.resolve([
        'project1',
        'project2',
        FAKE_PARENT_DIRECTORY_NAME,
        'project4',
      ]);
    });

    const result = await getParentDirectoryName();
    expect(result).to.equal(FAKE_PARENT_DIRECTORY_NAME);
  });

  test("it should return 'Root Directory' if the returned array was empty", async () => {
    pathStub.callsFake((...args: string[]) => {
      return args.join(FAKE_ROOT_PATH);
    });

    readdirStub.callsFake(() => {
      return Promise.resolve([]);
    });

    const result = await getParentDirectoryName();
    expect(result).to.equal('Root Directory');
  });

  test('it should throw DirectoryReadError if cannot read directory', async () => {
    pathStub.callsFake((...args: string[]) => {
      return args.join(FAKE_ROOT_PATH);
    });

    readdirStub.rejects(new Error('Cannot read directory'));

    try {
      await getParentDirectoryName();
      assert.fail('Expected DirectoryReadError was not thrown');
    } catch (error: any) {
      expect(error).to.be.instanceOf(DirectoryReadError);
      expect(error.message).to.contain('Cannot read directory');
    }
  });
});
