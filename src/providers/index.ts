import * as vs from 'vscode';
import { getRequiring } from '../utils/Should';
import { get, load } from '../lib';

const definitionProvider = vs.languages.registerDefinitionProvider(
  {
    scheme: 'file',
    language: 'javascript',
  },
  {
    provideDefinition(document, position) {
      const path = getRequiring(document, position);

      if (!path) {
        return [];
      }
      return get(path);
    },
  }
);

function subscribeToAliasrc() {
  if (vs.workspace.workspaceFolders?.length !== 1) {
    throw new Error('too much workspace');
  }

  const workfolder = vs.workspace.workspaceFolders[0];
  const pattern = new vs.RelativePattern(workfolder, '.aliasrc.json');
  const fileWatcher = vs.workspace.createFileSystemWatcher(pattern);
  fileWatcher.onDidChange(load);
  fileWatcher.onDidCreate(load);
  fileWatcher.onDidDelete(load);
  return fileWatcher;
}

export default [definitionProvider, subscribeToAliasrc()];
