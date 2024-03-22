// @ts-check

import { UNICODE_RANGES } from './consts.js';

function objToScssMap(obj) {
  const entries = Object.entries(obj).map(([k, v]) => `'${k}': '${v}'`);
  return `(${entries.join(', ')})`;
}

/**
 * @param {Record<string, Awaited<ReturnType<import('./config')['loadFontConfig']>>>} configs
 */
export function renderIndexSCSS(configs) {
  const fonts = Object.keys(configs)
    .map((x) => `'${x}'`)
    .join(',');

  const unicodeRanges = objToScssMap(UNICODE_RANGES);

  const weights = objToScssMap(Object.fromEntries(Object.entries(configs).map(([k, v]) => [k, v.weight])));

  return `$base-path: '@arma-events/web-fonts/dist/woff2' !default;

@use './_fallback_fonts.scss' as *;

@use './_template.scss' with (
    $base-path: $base-path,
    $unicode-ranges: ${unicodeRanges},
    $fonts: (${fonts}),
    $weights: ${weights},
);`;
}
