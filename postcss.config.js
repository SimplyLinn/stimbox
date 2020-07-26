/* eslint-disable import/no-extraneous-dependencies */
const tailwindconfig = require('tailwindcss/resolveConfig')(
  require('./tailwind.config.js'),
);

const darkTheme = tailwindconfig.theme.colors['dark-theme'];
const lightTheme = tailwindconfig.theme.colors['light-theme'];
const defaultTheme = darkTheme;

const mixins = {
  'theme-color': (mixin, prop, val) => {
    if (!(val in defaultTheme))
      console.warn(new ReferenceError(`Unknown theme property: ${val}`));
    return {
      [prop]: `var(--${val})`,
    };
  },
  'default-theme': () => {
    const clone = {};
    Object.keys(defaultTheme).forEach((key) => {
      clone[`--${key}`] = defaultTheme[key];
    });
    return clone;
  },
  'dark-theme': () => {
    const clone = {};
    Object.keys(darkTheme).forEach((key) => {
      clone[`--${key}`] = darkTheme[key];
    });
    return clone;
  },
  'light-theme': () => {
    const clone = {};
    Object.keys(lightTheme).forEach((key) => {
      clone[`--${key}`] = lightTheme[key];
    });
    return clone;
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
