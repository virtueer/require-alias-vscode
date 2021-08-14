import * as vs from 'vscode';
const fs = vs.workspace.fs;

let root: vs.Uri;

type Mapping = Record<string, string>;

export async function generate() {
  if (vs.workspace.workspaceFolders?.length !== 1) {
    throw new Error('too much workspace');
  }

  root = vs.workspace.workspaceFolders[0].uri;

  const file = (await loadFile()) || {};
  return resolvePaths(file);
}

async function loadFile() {
  const aliasrcUri = resolvePath('.aliasrc.json');

  return fs.readFile(aliasrcUri).then(
    bytes => JSON.parse(bytes.toString()),
    e => {
      if (e.code === 'FileNotFound') {
        vs.window.showErrorMessage('.aliasrc.json not found');
      }
    }
  );
}

function resolvePath(path: string, _root: vs.Uri | undefined = undefined) {
  return vs.Uri.joinPath(_root || root, path);
}

async function resolvePaths(mappings: Mapping) {
  const aliases: Record<string, vs.Uri> = {};

  for (const [key, value] of Object.entries(mappings)) {
    let uri: vs.Uri | null = resolvePath(value);
    const file = await getStat(uri);

    if (!file) {
      uri = null;
      vs.window.showErrorMessage(key + ' can not resolving');
    }

    if (uri && file?.type === vs.FileType.Directory) {
      uri = resolvePath('index.js', uri);
    }

    if (uri) {
      aliases[key] = uri;
    }
  }

  return aliases;
}

async function getStat(uri: vs.Uri) {
  let stat = null;
  try {
    stat = await fs.stat(uri);
  } catch (error) {
    return null;
  }

  return stat;
}
