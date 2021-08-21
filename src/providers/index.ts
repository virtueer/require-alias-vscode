import { subscribeToAliasrc } from "./WatchAliasrc";
import { definitionProvider } from "./Definition";
import { pathsCompletionProvider, requiresCompletionProvider } from "./Completion";

export default [
  subscribeToAliasrc(),
  definitionProvider,
  pathsCompletionProvider,
  requiresCompletionProvider,
];
