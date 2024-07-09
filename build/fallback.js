// @ts-check

import { join, resolve } from 'node:path';
import { generateFontFace, readMetrics } from 'fontaine';
import { FALLBACK_FONTS_DIR, STYLES } from './consts.js';
import { arrayToScssList } from './scss.js';

/**
 * @param {Record<string, Awaited<ReturnType<import('./config')['loadFontConfig']>>>} configs
 */
export async function renderFallbackFontsSCSS(configs) {
  let scss = `$families: ${arrayToScssList(Object.keys(configs))} !default;\n`;
  scss += `$styles: ${arrayToScssList(STYLES)} !default;\n`;
  scss += '\n';
  scss += `@use "sass:list";\n`;
  scss += '\n';

  for (const [font, config] of Object.entries(configs)) {
    for (const style of STYLES) {
      const metrics = await loadMetrics(join(config.path, 'static', `${style}.ttf`));

      const fallbackFamily = config.fallbackFontFamily + (style === 'normal' ? '' : ' Italic');
      const fallbackMetrics = await loadMetrics(join(FALLBACK_FONTS_DIR, fallbackFamily + '.ttf'));

      const fontFace = generateFontFace(metrics, {
        font: fallbackFamily,
        name: `${font} Fallback`,
        metrics: fallbackMetrics,
        'font-style': style,
      });

      scss += `@if list.index($families, '${font}') and list.index($styles, '${style}') {\n`;
      scss += `  ${fontFace.replace(/\n$/, '').replace(/\n/g, '\n  ')}\n`;
      scss += `}\n`;
    }
  }

  return scss;
}

/**
 * @param {string} path
 */
export async function loadMetrics(path) {
  const metrics = await readMetrics('file://' + resolve(path));
  if (metrics === null) throw new Error(`Failed to get metrics for file '${path}'.`);

  return metrics;
}
