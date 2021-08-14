import { subscribeToAliasrc } from "./WatchAliasrc";
import { definitionProvider } from "./Definition";
import { completionProvider } from "./Completion";

export default [definitionProvider, completionProvider, subscribeToAliasrc()];
