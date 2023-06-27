import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { use, expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as getDirectoryStructureUtil from '../../utils/getDirectoryStructure';
import { OUTPUT_FILE_NAME, activate } from '../../extension';
import * as getRootPathModule from '../../utils/getRootPath';

use(sinonChai);

suite('Extension', () => {
  let registerCommandStub: sinon.SinonStub;
  let writeFileSyncStub: sinon.SinonStub;
  let getDirectoryStructureStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;
  let getRootPathStub: sinon.SinonStub;

  const FAKE_ROOT_PATH = '/home/fake/Projects/project3';
  const FAKE_OUTPUT = 'fake└─project├─hierarchy';

  setup(() => {
    registerCommandStub = sinon.stub(vscode.commands, 'registerCommand');
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
    getDirectoryStructureStub = sinon
      .stub(getDirectoryStructureUtil, 'getDirectoryStructure')
      .callsFake(() => Promise.resolve(FAKE_OUTPUT));
    showInformationMessageStub = sinon.stub(
      vscode.window,
      'showInformationMessage'
    );

    getRootPathStub = sinon
      .stub(getRootPathModule, 'getRootPath')
      .callsFake(() => {
        return `${FAKE_ROOT_PATH}`;
      });
  });

  teardown(() => {
    registerCommandStub.restore();
    writeFileSyncStub.restore();
    getDirectoryStructureStub.restore();
    showInformationMessageStub.restore();
    getRootPathStub.restore();
  });

  test('it should register the command successfully', () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    activate(mockContext);
    expect(registerCommandStub).to.have.been.calledWith(
      'project-hierarchy-explorer.generate'
    );
  });

  test('it should write the directory structure to a file', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    activate(mockContext);

    const commandHandler = registerCommandStub.getCall(0).args[1];
    await commandHandler();

    expect(getDirectoryStructureStub).to.have.been.calledWith(FAKE_ROOT_PATH);
    expect(writeFileSyncStub).to.have.been.calledWith(
      path.join(FAKE_ROOT_PATH, OUTPUT_FILE_NAME),
      'project3\n' + FAKE_OUTPUT
    );
  });
});
