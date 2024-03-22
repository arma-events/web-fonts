// @ts-check

import { readFile } from 'node:fs/promises';
import { parse, join, relative } from 'node:path';
import chalk from 'chalk';

export async function importJSON(path) {
  const text = await readFile(path, 'utf-8');
  return JSON.parse(text);
}

export function coloredPath(path) {
  const parsed = parse(path);

  const dir = relative('.', parsed.dir);

  return chalk.dim(join('.\u200B', dir, chalk.reset(parsed.name + parsed.ext)));
}
