// @ts-check

import { existsSync } from 'node:fs';
import { rm, mkdir, copyFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { exec as execOriginal } from 'node:child_process';
import { compileAsync } from 'sass';
import prettyBytes from 'pretty-bytes';
import chalk from 'chalk';
import { loadFontConfig } from './config.js';
import { IN_DIR, OUT_DIR, ROOT_DIR, STYLES, UNICODE_RANGES } from './consts.js';
import { renderIndexSCSS } from './scss.js';
import { renderFallbackFontsCSS } from './fallback.js';
import { coloredPath } from './utils.js';

const exec = promisify(execOriginal);

// recreate out directory
if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true });
await mkdir(OUT_DIR);
console.log('🔥 Cleared', coloredPath(OUT_DIR));

/**
 * @type {Record<string, Awaited<ReturnType<typeof loadFontConfig>>>}
 */
const CONFIGS = await readdir(IN_DIR)
  .then((fonts) => Promise.all(fonts.map((font) => loadFontConfig(font).then((config) => [font, config]))))
  .then(Object.fromEntries);

console.log('');
console.log(
  `🔍 Found ${chalk.cyan(Object.keys(CONFIGS).length + ' fonts') + chalk.dim(':')} ${Object.keys(CONFIGS).join(
    chalk.dim(', '),
  )}`,
);
console.log('');

// _template.scss
{
  const path = join(OUT_DIR, '_template.scss');
  await copyFile(join(ROOT_DIR, '_template.scss'), path);
  console.log('✅ Copied _template.scss to', coloredPath(path));
}

// _fallback_fonts.scss
{
  const path = join(OUT_DIR, '_fallback_fonts.scss');
  await writeFile(path, await renderFallbackFontsCSS(CONFIGS), 'utf-8');
  console.log('📝 Wrote Fallback Fonts to', coloredPath(path));
}

// index.scss
{
  const path = join(OUT_DIR, 'index.scss');
  await writeFile(path, renderIndexSCSS(CONFIGS), 'utf-8');
  console.log('📝 Wrote', coloredPath(path));
}

// index.css
{
  const result = await compileAsync(join(OUT_DIR, 'index.scss'));
  const path = join(OUT_DIR, 'index.css');
  await writeFile(path, result.css, 'utf-8');
  console.log('📦️ Compiled', coloredPath(path));
}

// Write woff2 files
await mkdir(join(OUT_DIR, 'woff2'));
for (const [font, config] of Object.entries(CONFIGS)) {
  await mkdir(join(OUT_DIR, 'woff2', font));
  console.log('');
  console.log(`➡️  Generating woff2 files for ${chalk.underline(font)}`);

  for (const [rangeName, range] of Object.entries(UNICODE_RANGES)) {
    for (const style of STYLES) {
      const inPath = join(config.path, `${style}.ttf`);
      const outPath = join(OUT_DIR, 'woff2', font, `${style}.${rangeName}.woff2`);

      await exec(`pyftsubset "${inPath}" --with-zopfli --output-file="${outPath}" --unicodes="${range}"`);
      const { size } = await stat(outPath);
      console.log(`    ${coloredPath(outPath)} (${chalk.greenBright(prettyBytes(size))})`);
    }
  }
  console.log(`✅ Generated woff2 files for ${chalk.underline(font)}`);
}

console.log('');
console.log(`🎉 Finished!`);
console.log('');
