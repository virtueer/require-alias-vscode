import * as vs from "vscode";
import { listAliases } from "../../../lib";
import { getRequiring, getBetweenQuotes } from "../../../utils/Should";

const pathsCompletionProvider = vs.languages.registerCompletionItemProvider(
  {
    scheme: "file",
    language: "javascript",
  },
  {
    provideCompletionItems(document, position) {
      const line = document.getText(document.lineAt(position).range);
      const path = getRequiring(document, position);
      const req = getBetweenQuotes(line);
      req ? req.index++ : void 0;

      if (path !== "" && !path) {
        return [];
      }

      const aliases = listAliases();
      const filteredAliases = aliases
        .filter((alias) => alias.startsWith(path))
        .map((alias) => {
          const item = new vs.CompletionItem(alias);
          if (req?.index) {
            const start = new vs.Position(position.line, req.index);
            const end = new vs.Position(position.line, line.length - 2);

            item.range = new vs.Range(start, end);
          }
          return item;
        });

      return filteredAliases;
    },
  },
  `'`,
  `"`
);

export { pathsCompletionProvider };
