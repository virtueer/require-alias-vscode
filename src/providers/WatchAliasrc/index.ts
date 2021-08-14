import * as vs from "vscode";
import { load } from "../../lib";

export function subscribeToAliasrc() {
  if (vs.workspace.workspaceFolders?.length !== 1) {
    throw new Error("too much workspace");
  }

  const workfolder = vs.workspace.workspaceFolders[0];
  const pattern = new vs.RelativePattern(workfolder, ".aliasrc.json");
  const fileWatcher = vs.workspace.createFileSystemWatcher(pattern);
  fileWatcher.onDidChange(load);
  fileWatcher.onDidCreate(load);
  fileWatcher.onDidDelete(load);
  return fileWatcher;
}
