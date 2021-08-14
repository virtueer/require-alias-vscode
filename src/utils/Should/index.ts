import * as vs from 'vscode';

interface Line {
  str: string;
  index: number;
}

export function getRequiring(document: vs.TextDocument, position: vs.Position) {
  const line = document.getText(document.lineAt(position).range);
  const request = getBetweenQuotes(line);

  if (!request) {
    return null;
  }
  const requiring = line.slice(request.index - 8, request.index); // 8 means: "require(".length

  // reject if not requiring
  if (requiring !== 'require(') {
    return null;
  }

  // reject if not clicking inside parentheses
  if (position.character <= request.index) {
    return null;
  }
  return request.str;
}

export function getBetweenQuotes(line: string): Line | null {
  const str = /'(.*?)'/.exec(line) || /"(.*?)"/.exec(line);
  if (str) {
    return { str: str[1], index: str.index };
  }
  return null;
}
