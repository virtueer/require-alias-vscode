import * as vs from "vscode";
import { getRequiring } from "../../utils/Should";
import { get } from "../../lib";

const definitionProvider = vs.languages.registerDefinitionProvider(
  {
    scheme: "file",
    language: "javascript",
  },
  {
    provideDefinition(document, position) {
      const path = getRequiring(document, position);

      if (!path) {
        return [];
      }
      return get(path) as vs.Definition;
    },
  }
);

export { definitionProvider };
