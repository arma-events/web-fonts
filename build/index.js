// @ts-check

import { existsSync } from 'node:fs';
import { rm, mkdir, copyFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { exec as execOriginal } from 'node:child_process';
import { compileAsync, compileStringAsync } from 'sass';
import prettyBytes from 'pretty-bytes';
import chalk from 'chalk';
import { loadFontConfig } from './config.js';
import { IN_DIR, OUT_DIR, ROOT_DIR, STYLES, TEST_APP_DIR, UNICODE_RANGES } from './consts.js';
import { arrayToScssList, objToScssMap } from './scss.js';
import { renderFallbackFontsSCSS } from './fallback.js';
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

// index.scss
{
  const path = join(OUT_DIR, 'index.scss');
  await copyFile(join(ROOT_DIR, 'index.scss'), path);
  console.log('✅ Copied index.scss to', coloredPath(path));
}

// _build_info.scss
{
  const path = join(OUT_DIR, '_build_info.scss');
  await writeFile(
    path,
    [
      `@use 'sass:map';`,
      `$families: ${arrayToScssList(Object.keys(CONFIGS))};`,
      `$styles: ${arrayToScssList(STYLES)};`,
      `$weights: ${objToScssMap(Object.fromEntries(Object.entries(CONFIGS).map(([k, v]) => [k, v.weight])))};`,
      `$unicode-ranges: ${objToScssMap(UNICODE_RANGES)};`,
      `$ranges: map.keys($unicode-ranges)`,
    ].join('\n'),
  );
  console.log('📝 Wrote build infos to', coloredPath(path));
}

// _fallback_fonts.scss
{
  const path = join(OUT_DIR, '_fallback_fonts.scss');
  await writeFile(path, await renderFallbackFontsSCSS(CONFIGS), 'utf-8');
  console.log('📝 Wrote Fallback Fonts to', coloredPath(path));
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

// test app
{
  console.log('');
  console.log('➡️  Generating test app in', coloredPath(TEST_APP_DIR));

  if (existsSync(TEST_APP_DIR)) await rm(TEST_APP_DIR, { recursive: true });
  await mkdir(TEST_APP_DIR);
  console.log('    🔥 Cleared', coloredPath(TEST_APP_DIR));

  const htmlPath = join(TEST_APP_DIR, 'index.html');
  await copyFile(join(ROOT_DIR, 'build', 'index.html'), htmlPath);
  console.log('    ✅ Copied index.html to', coloredPath(htmlPath));

  const result = await compileStringAsync(`@use '../dist/index.scss' with ($base-path: '../dist/woff2');`, {
    url: new URL(resolve(join(TEST_APP_DIR, 'index.scss')), 'file://'),
  });
  const cssPath = join(TEST_APP_DIR, 'index.css');
  await writeFile(cssPath, result.css, 'utf-8');
  console.log('    📦️ Compiled', coloredPath(cssPath));
}

console.log('');
console.log(`🎉 Finished!`);
console.log('');
