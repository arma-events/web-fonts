// @ts-check

import { STYLES, UNICODE_RANGES } from './consts.js';

/**
 * @param {Record<string, string>} obj
 * @returns {string}
 */
export function objToScssMap(obj) {
  const entries = Object.entries(obj).map(([k, v]) => `'${k}': '${v}'`);
  return `(${entries.join(', ')})`;
}

/**
 * @param {readonly string[]} arr
 * @returns {string}
 */
export function arrayToScssList(arr) {
  return '(' + arr.map((x) => `'${x}'`).join(',') + ')';
}
