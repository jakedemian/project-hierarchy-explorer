import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { use, expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as getDirectoryStructureUtil from '../../utils/getDirectoryStructure';
import { OUTPUT_FILE_NAME, SUCCESS_MESSAGE, activate } from '../../extension';
import * as getRootPathModule from '../../utils/getRootPath';
import * as config from '../../utils/getConfiguration';

use(sinonChai);

// ? TODO split this file into extension.test.ts and generate.test.ts
// if so, I think the extension tests would only check output, and generate tests would
// check that all the methods were called properly.  Or maybe the opposite....
suite('Extension', () => {
  let registerCommandStub: sinon.SinonStub;
  let writeFileSyncStub: sinon.SinonStub;
  let getDirectoryStructureStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;
  let getRootPathStub: sinon.SinonStub;
  let getConfigurationStub: sinon.SinonStub;
  let createOutputChannelStub: sinon.SinonStub;
  let appendStub: sinon.SinonStub;
  let showStub: sinon.SinonStub;
  let showInputBoxStub: sinon.SinonStub;

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
    getConfigurationStub = sinon.stub(config, 'getConfiguration');
    createOutputChannelStub = sinon.stub(vscode.window, 'createOutputChannel');
    const outputChannel = {
      append: sinon.stub(),
      show: sinon.stub(),
    };
    createOutputChannelStub.returns(outputChannel);
    appendStub = outputChannel.append;
    showStub = outputChannel.show;
    showInputBoxStub = sinon.stub(vscode.window, 'showInputBox');
  });

  teardown(() => {
    registerCommandStub.restore();
    writeFileSyncStub.restore();
    getDirectoryStructureStub.restore();
    showInformationMessageStub.restore();
    getRootPathStub.restore();
    getConfigurationStub.restore();
    createOutputChannelStub.restore();
    showInputBoxStub.restore();
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

  test('it should write the directory structure to a file when configured to do so', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    getConfigurationStub.withArgs('outputsTo').returns('file');
    getConfigurationStub.withArgs('suppressNotification').returns(true);

    activate(mockContext);
    const commandHandler = registerCommandStub.getCall(0).args[1];
    await commandHandler();

    expect(getDirectoryStructureStub).to.have.been.calledWith({
      dirPath: FAKE_ROOT_PATH,
      ignorePatterns: [],
    });
    expect(writeFileSyncStub).to.have.been.calledWith(
      path.join(FAKE_ROOT_PATH, OUTPUT_FILE_NAME),
      'project3\n' + FAKE_OUTPUT
    );
  });

  test('it should NOT write the directory structure to a file when configured for console output', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    getConfigurationStub.withArgs('outputsTo').returns('console');
    getConfigurationStub.withArgs('suppressNotification').returns(true);

    activate(mockContext);
    const commandHandler = registerCommandStub.getCall(0).args[1];
    await commandHandler();

    expect(getDirectoryStructureStub).to.have.been.calledWith({
      dirPath: FAKE_ROOT_PATH,
      ignorePatterns: [],
    });
    expect(writeFileSyncStub).to.not.have.been.calledWith(
      path.join(FAKE_ROOT_PATH, OUTPUT_FILE_NAME),
      'project3\n' + FAKE_OUTPUT
    );
  });

  test('it should write the directory structure to the output window when configured to do so', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    getConfigurationStub.withArgs('outputsTo').returns('console');
    getConfigurationStub.withArgs('suppressNotification').returns(true);

    activate(mockContext);
    const commandHandler = registerCommandStub.getCall(0).args[1];
    await commandHandler();

    expect(getDirectoryStructureStub).to.have.been.calledWith({
      dirPath: FAKE_ROOT_PATH,
      ignorePatterns: [],
    });
    expect(createOutputChannelStub).to.have.been.calledWith(
      'Project Hierarchy Explorer'
    );
    expect(appendStub).to.have.been.called;
    expect(showStub).to.have.been.called;
  });

  test('it should NOT write the directory structure to the output window if configured for file output', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    getConfigurationStub.withArgs('outputsTo').returns('file');
    getConfigurationStub.withArgs('suppressNotification').returns(true);

    activate(mockContext);
    const commandHandler = registerCommandStub.getCall(0).args[1];
    await commandHandler();

    expect(getDirectoryStructureStub).to.have.been.calledWith({
      dirPath: FAKE_ROOT_PATH,
      ignorePatterns: [],
    });
    expect(createOutputChannelStub).to.not.have.been.calledWith(
      'Project Hierarchy Explorer'
    );
    expect(appendStub).to.not.have.been.called;
    expect(showStub).to.not.have.been.called;
  });

  test('it should write the directory structure to both the output window and a file when configured to do so', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    getConfigurationStub.withArgs('outputsTo').returns('both');
    getConfigurationStub.withArgs('suppressNotification').returns(true);

    activate(mockContext);
    const commandHandler = registerCommandStub.getCall(0).args[1];
    await commandHandler();

    expect(getDirectoryStructureStub).to.have.been.calledWith({
      dirPath: FAKE_ROOT_PATH,
      ignorePatterns: [],
    });
    expect(createOutputChannelStub).to.have.been.calledWith(
      'Project Hierarchy Explorer'
    );
    expect(appendStub).to.have.been.called;
    expect(showStub).to.have.been.called;
    expect(writeFileSyncStub).to.have.been.calledWith(
      path.join(FAKE_ROOT_PATH, OUTPUT_FILE_NAME),
      'project3\n' + FAKE_OUTPUT
    );
  });

  test('it should show a notification when successful and suppressNotification is false', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;

    getConfigurationStub.withArgs('outputsTo').returns('both');
    getConfigurationStub.withArgs('suppressNotification').returns(false);

    activate(mockContext);
    const commandHandler = registerCommandStub.getCall(0).args[1];
    await commandHandler();

    expect(showInformationMessageStub).to.have.been.calledWith(SUCCESS_MESSAGE);
  });

  test('it generates a partial hierarchy if a relativePath was passed into generate()', async () => {
    const mockContext = {
      subscriptions: [],
    } as any;
    const FAKE_RELATIVE_PATH = 'src/utils';

    getConfigurationStub.withArgs('outputsTo').returns('both');
    getConfigurationStub.withArgs('suppressNotification').returns(true);
    showInputBoxStub.returns(Promise.resolve(FAKE_RELATIVE_PATH));

    activate(mockContext);
    const commandHandler = registerCommandStub.getCall(1).args[1]; // using the second command (index 1) for generatePartial
    await commandHandler();

    expect(getDirectoryStructureStub).to.have.been.calledWith({
      dirPath: path.join(FAKE_ROOT_PATH, FAKE_RELATIVE_PATH),
      ignorePatterns: [],
    });
    expect(writeFileSyncStub).to.have.been.calledWith(
      path.join(FAKE_ROOT_PATH, OUTPUT_FILE_NAME),
      'utils\n' + FAKE_OUTPUT
    );
  });

  test(
    'it should not display the input box during Generate Partial command if a relativePath value ' +
      'was supplied',
    async () => {
      const mockContext = {
        subscriptions: [],
      } as any;

      const FAKE_RELATIVE_PATH = 'src/components';

      activate(mockContext);
      const commandHandler = registerCommandStub.getCall(1).args[1]; // getCall(1) because _generatePartial is the second registered command
      await commandHandler(FAKE_RELATIVE_PATH);

      expect(showInputBoxStub).to.not.have.been.called;

      showInputBoxStub.restore();
    }
  );
});
