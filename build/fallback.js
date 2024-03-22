// @ts-check

import { join, resolve } from 'node:path';
import { generateFontFace, readMetrics } from 'fontaine';
import { FALLBACK_FONTS_DIR, STYLES } from './consts.js';

/**
 * @param {Record<string, Awaited<ReturnType<import('./config')['loadFontConfig']>>>} configs
 */
export async function renderFallbackFontsCSS(configs) {
  let css = '';
  for (const [font, config] of Object.entries(configs)) {
    for (const style of STYLES) {
      const metrics = await loadMetrics(join(config.path, 'static', `${style}.ttf`));

      const fallbackFamily = config.fallbackFontFamily + (style === 'normal' ? '' : ' Italic');
      const fallbackMetrics = await loadMetrics(join(FALLBACK_FONTS_DIR, fallbackFamily + '.ttf'));

      css += generateFontFace(metrics, {
        font: fallbackFamily,
        name: `${font} Fallback`,
        metrics: fallbackMetrics,
        'font-style': style,
      });
    }
  }

  return css;
}

/**
 * @param {string} path
 */
export async function loadMetrics(path) {
  const metrics = await readMetrics('file://' + resolve(path));
  if (metrics === null) throw new Error(`Failed to get metrics for file '${path}'.`);

  return metrics;
}
