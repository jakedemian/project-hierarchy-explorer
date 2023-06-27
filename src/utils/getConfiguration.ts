import * as vscode from 'vscode';

const CONFIG_NAMESPACE = 'project-hierarchy-explorer';

export const CONFIG = {
  ignorePatterns: 'ignorePatterns' as const,
  outputsTo: 'defaultOutput' as const,
};

type ConfigKeys = typeof CONFIG;
type ConfigKey = keyof ConfigKeys;

interface ConfigTypes {
  ignorePatterns: string[];
  outputsTo: 'console' | 'file' | 'both';
}

export const getConfiguration = <K extends ConfigKey>(
  key: K
): ConfigTypes[K] | undefined => {
  const configuration = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
  return configuration.get<ConfigTypes[K]>(key);
};
