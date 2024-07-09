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

/**
 * @param {Record<string, Awaited<ReturnType<import('./config')['loadFontConfig']>>>} configs
 */
export function renderIndexSCSS(configs) {
  const fonts = arrayToScssList(Object.keys(configs));

  const unicodeRanges = objToScssMap(UNICODE_RANGES);

  const weights = objToScssMap(Object.fromEntries(Object.entries(configs).map(([k, v]) => [k, v.weight])));

  return `$base-path: '@arma-events/web-fonts/dist/woff2' !default;
$families: ${fonts} !default;
$styles: ${arrayToScssList(STYLES)} !default;
$ranges: ${arrayToScssList(Object.keys(UNICODE_RANGES))} !default;

@use 'sass:list';


@use './_fallback_fonts.scss' with (
  $families: $families,
  $styles: $styles,
);

@use './_template.scss' with (
  $base-path: $base-path,
  $named-unicode-ranges: ${unicodeRanges},
  $ranges: $ranges,
  $families: $families,
  $styles: $styles,
  $weights: ${weights},
);

$-available-styles: ${arrayToScssList(STYLES)};
@each $style in $styles {
 @if not list.index($-available-styles, $style) {
    @error "#{$style} is not a valid style. Expected one of #{$-available-styles}.";
  }
}

$-available-families: ${fonts};
@each $family in $families {
 @if not list.index($-available-families, $family) {
    @error "#{$family} is not a valid family. Expected one of #{$-available-families}.";
  }
}

$-available-ranges: ${arrayToScssList(Object.keys(UNICODE_RANGES))};
@each $range in $ranges {
 @if not list.index($-available-ranges, $range) {
    @error "#{$range} is not a valid range. Expected one of #{$-available-ranges}.";
  }
}`;
}
