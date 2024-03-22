// @ts-check

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importJSON } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT_DIR = join(__dirname, '..');
export const IN_DIR = join(ROOT_DIR, 'fonts');
export const OUT_DIR = join(ROOT_DIR, 'dist');
export const FALLBACK_FONTS_DIR = join(ROOT_DIR, 'fallback_fonts');

/**
 * @type {import('../unicode_ranges.json')}
 */
export const UNICODE_RANGES = await importJSON(join(ROOT_DIR, 'unicode_ranges.json'));

export const STYLES = /** @type {const} */ (['normal', 'italic']);
