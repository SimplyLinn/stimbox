/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @type {{ dark: Partial<Record<string, string>>; light: Partial<Record<string, string>>; }}
 */
const themes = require('tailwindcss/resolveConfig')(
  require('./tailwind.config.js'),
).theme.colors.modes;

const { defaultMode } = require('./config.json');

const mixins = {
  'theme-color': (mixin, prop, val) => {
    if (!(val in themes[defaultMode]))
      console.warn(new ReferenceError(`Unknown theme property: ${val}`));
    return {
      [prop]: [themes[defaultMode][val], `var(--${val})`],
    };
  },
  'theme-color-complex': (
    mixin,
    prop,
    prefix,
    preSpacer,
    val,
    postSpacer,
    suffix = '',
  ) => {
    if (!(val in themes[defaultMode]))
      console.warn(new ReferenceError(`Unknown theme property: ${val}`));
    return {
      [prop]: [
        `${prefix}${preSpacer === 'true' ? ' ' : ''}${
          themes[defaultMode][val]
        }${postSpacer === 'true' ? ' ' : ''}${suffix}`,
        `${prefix}${preSpacer === 'true' ? ' ' : ''}var(--${val})${
          postSpacer === 'true' ? ' ' : ''
        }${suffix}`,
      ],
    };
  },
  themes: () => {
    const root = { ':root': {} };
    Object.keys(themes[defaultMode]).forEach((key) => {
      root[':root'][`--${key}`] = themes[defaultMode][key];
    });
    Object.keys(themes).forEach((theme) => {
      root[`@media (prefers-color-scheme: ${theme})`] = null;
    });
    Object.keys(themes).forEach((theme) => {
      root[`body.${theme}-theme`] = null;
    });
    Object.keys(themes).forEach((theme) => {
      const themeObj = {};
      Object.keys(themes.dark).forEach((key) => {
        themeObj[`--${key}`] = themes[theme][key];
      });
      root[`@media (prefers-color-scheme: ${theme})`] = { ':root': themeObj };
      root[`body.${theme}-theme`] = themeObj;
    });
    return root;
  },
};

module.exports = {
  plugins: [
    'postcss-import',
    [
      'postcss-mixins',
      {
        mixins,
      },
    ],
    'tailwindcss',
    'postcss-preset-env',
  ],
};
