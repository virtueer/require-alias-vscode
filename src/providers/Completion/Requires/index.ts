import * as vs from "vscode";
import { get } from "../../../lib";

const requiresCompletionProvider = vs.languages.registerCompletionItemProvider(
  {
    scheme: "file",
    language: "javascript",
  },
  {
    provideCompletionItems(document, position) {
      console.log("providing");
      const line = document.getText(document.lineAt(position).range);

      const requireRegex = /require\((.*?)\);?/;
      const requireResult = requireRegex.exec(line);

      if (!requireResult) {
        return null;
      }

      const requirePart = requireResult[0];
      const alias = requireResult[1].replace(/'|"/g, "");

      if (!line.trim().endsWith(requirePart)) {
        return null;
      }

      const patternRegex = /{(.*(?!.*\1)?)}/;
      const patternResult = patternRegex.exec(line);

      if (!patternResult) {
        return null;
      }

      const uri = get(alias, true) as vs.Uri;

      if (!uri) {
        return null;
      }

      const items: vs.CompletionItem[] = [];

      const allExports = require(uri.fsPath);

      for (const key in allExports) {
        if (Object.prototype.hasOwnProperty.call(allExports, key)) {
          const item = new vs.CompletionItem(key, vs.CompletionItemKind.Field);
          item.sortText = items.length.toString();

          const object = allExports[key];
          item.detail =
            object?.constructor.name ||
            Object.prototype.toString.call(object).slice(8, -1);
          items.push(item);
        }
      }

      const patternPart = patternResult[1].trim();

      // eğer :{ eşleşiyorsa
      if (/:(\s+)?{/.exec(patternPart)) {
        return destructingLoop(line, allExports);
      }

      return items;
    },
  }
);

function destructingLoop(part: string, allExports: any): vs.CompletionItem[] {
  const regex = /({.+?(?=(:|}|{|=|,)))/g;
  const matches = part.match(regex) || [];
  const list = matches.map((x) => x.replace("{", "").trim());

  if (list.length > 1) {
    list.pop();
  }
  return getLoopProps(list, allExports);
}

function getLoopProps(
  array: Array<string>,
  allExports: any
): vs.CompletionItem[] {
  let lastProps;
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (i === 0) {
      lastProps = allExports[element];
      continue;
    }

    // @ts-ignore
    const lastElement = lastProps[element];
    if (typeof lastElement !== "object") {
      return [];
    }
    lastProps = lastElement;
  }

  const items: vs.CompletionItem[] = [];
  const props = Object.keys(lastProps);

  for (const key of props) {
    const object = lastProps[key];

    const item = new vs.CompletionItem(key, vs.CompletionItemKind.Field);
    item.sortText = items.length.toString();

    item.detail =
      object?.constructor.name ||
      Object.prototype.toString.call(object).slice(8, -1);

    items.push(item);
  }
  return items;
}

export { requiresCompletionProvider };
