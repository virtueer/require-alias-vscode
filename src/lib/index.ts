import * as vs from "vscode";
import { generate } from "../utils/Loader";

let aliases: Record<string, vs.Uri> = {};

export async function load() {
  aliases = {};
  aliases = await generate();
}

export function get(alias: string) {
  const uri = aliases[alias];
  if (!uri) {
    return [];
  }

  return new vs.Location(
    uri,
    new vs.Range(new vs.Position(0, 0), new vs.Position(0, 0))
  );
}

export function listAliases(){
  return Object.keys(aliases);
}
