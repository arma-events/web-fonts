# Web Fonts for arma.events

This package includes all web fonts used in arma.events and related projects.

Each font is...

- ...segmented in multiple unicode ranges so that a browser only needs to download the font resource needed for the displayed text content
- ...accompanied by a fallback font that should be displayed while the resources are loading. It is a font that is locally available on most systems and is adjusted to match the size of the target font as closely as possible to reduce layout shift.

## Installation

```
npm i @arma-events/web-fonts
```

## Usage

Simply include the css file, which includes font-faces for all font as well as their fallback fonts:

```css
@import '@arma-events/web-fonts/dist/index.css';

/* Use the font */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Raleway', 'Raleway Fallback', sans-serif; /* Make sure to include the fallback font to reduce layout shift */
}
```

### Advanced usage

When you are using [SASS](https://sass-lang.com/) (or SCSS) you can also import the `index.scss`, which allows configuration which font families, Unicode ranges and styles should be included as well as from where the font files are loaded.

<!-- prettier-ignore -->
```scss
// NOTE: omit the variable entirely to keep the default value

@use '@arma-events/web-fonts/dist/index.scss' with (
  // no trailing slash;
  // would attempt to load '~my/font/files/Raleway/italic.latin.woff2'
  //                        ^^^^^^^^^^^^^^ ^^^^^^^ ^^^^^^ ^^^^^
  //                        Your Path      Family  Style  Range
  $base-path: '~my/font/files',

  // only include Source Sans 3 and Raleway in the italic-style
  // and latin as well as latin-ext ranges
  $families: ('Source Sans 3', 'Raleway'),
  $styles: ('italic'),
  $ranges: ('latin', 'latin-ext'),
);
```

#### Variables

> [!IMPORTANT]
> All "Allowed Values" below might be outdated. Check the `dist/_build_info.scss` file in your package directory for the correct values.

##### `$base-path`

| Name           | Value                                                         |
| :------------- | :------------------------------------------------------------ |
| Description    | Base path of woff files to load (without a trailing slash)    |
| Default Value  | `@arma-events/web-fonts/dist/woff2`                           |
| Type           | [String](https://sass-lang.com/documentation/values/strings/) |
| Allowed Values | -                                                             |

##### `$families`

| Name           | Value                                                            |
| :------------- | :--------------------------------------------------------------- |
| Description    | Font families to include                                         |
| Default Value  | All families                                                     |
| Type           | [List](https://sass-lang.com/documentation/values/lists/)        |
| Allowed Values | one or multiple of `Source Sans 3`, `Source Code Pro`, `Raleway` |

##### `$styles`

| Name           | Value                                                     |
| :------------- | :-------------------------------------------------------- |
| Description    | Font styles to include                                    |
| Default Value  | All styles                                                |
| Type           | [List](https://sass-lang.com/documentation/values/lists/) |
| Allowed Values | one or multiple of `normal`, `italic`                     |

##### `$ranges`

| Name           | Value                                                                                                   |
| :------------- | :------------------------------------------------------------------------------------------------------ |
| Description    | Unicode ranges to include                                                                               |
| Default Value  | All built ranges                                                                                        |
| Type           | [List](https://sass-lang.com/documentation/values/lists/)                                               |
| Allowed Values | one or multiple of `cyrillic-ext`, `cyrillic`, `greek-ext`, `greek`, `vietnamese`, `latin-ext`, `latin` |
