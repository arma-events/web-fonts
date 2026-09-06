// @ts-check

import { join } from 'node:path';
import { Type } from 'typebox';
import Schema from 'typebox/schema';
import { importJSON } from './utils.js';
import { IN_DIR } from './consts.js';

const CONFIG_SCHEMA = Schema.Compile(
  Type.Object(
    {
      weight: Type.String(),
      fallbackFontFamily: Type.String(),
    },
    { additionalProperties: false },
  ),
);

/**
 * @param {string} name
 */
export async function loadFontConfig(name) {
  const json = await importJSON(join(IN_DIR, name, 'config.json'));
  return { ...CONFIG_SCHEMA.Parse(json), path: join(IN_DIR, name) };
}
