import * as vs from 'vscode';
import providers from './providers';
import { load } from './lib';

export async function activate(context: vs.ExtensionContext) {
  await load();
  context.subscriptions.push(...providers);
}

export function deactivate() {}
