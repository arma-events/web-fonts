# Web Fonts for arma.events

This package includes all web fonts used in arma.events and related projects. Each font is segmented in multiple unicode ranges so that a browser only needs to download the font resource needed for the displayed text content.
Furthermore each font is accompanied by a fallback font that should be displayed while the resources are loading. It is a font that is locally available on most systems and is adjusted to match the size of the target font as closely as possible to reduce layout shift.

## Installation

```
npm i @arma-events/web-fonts
```

> [!IMPORTANT]
> Make sure the `.npmrc` file in your project correctly configures the GitHub package registry for the `@arma-events/`-namespace:
>
> ```
> # .npmrc
> @arma-events:registry=https://npm.pkg.github.com
> ```

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
