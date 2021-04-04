/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
/**
 * @type {{ dark: Partial<Record<string, string>>; light: Partial<Record<string, string>>; }}
 */
const path = require('path');
const c = require('chalk');
const themes = require('tailwindcss/resolveConfig')(
  require('./tailwind.config.js'),
).theme.colors.modes;

const { defaultMode } = require('./config.json');

function printSource(mixin, error) {
  const lines = mixin.source.input.css
    .split('\n')
    .slice(mixin.source.start.line - 1, mixin.source.end.line)
    .flatMap((element, index, arr) => {
      let start = 0;
      let end = element.length;
      if (index === 0) {
        start = mixin.source.start.column - 1;
      }
      if (index === arr.length - 1) {
        end = mixin.source.end.column;
      }
      const space1 = ' '.repeat(start);
      const arrows = '^'.repeat(end - start);
      const space2 = ' '.repeat(element.length - end);
      return [element, `${space1}${c.red(arrows)}${space2}`];
    });
  // eslint-disable-next-line no-console
  console.log(
    `${c.cyan(
      path
        .relative(process.cwd(), mixin.source.input.file)
        .split(path.sep)
        .join('/'),
    )}${c.yellow(
      `:${mixin.source.start.line}:${mixin.source.start.column}`,
    )} - ${c.red(error.name)} ${error.message}\n\n${lines.join('\n')}`,
  );
}

const mixins = {
  'theme-color': (mixin, prop, val) => {
    const ret = [];
    if (!(val in themes[defaultMode])) {
      printSource(mixin, new ReferenceError(`Unknown theme property: ${val}`));
    } else {
      ret.push(themes[defaultMode][val]);
    }
    ret.push(`var(--${val})`);
    return {
      [prop]: ret,
    };
  },
  'theme-color-template': (mixin, prop, template, stripQuotes = true) => {
    const reported = [];
    if (stripQuotes) {
      if (template.startsWith("'")) {
        // eslint-disable-next-line no-param-reassign
        template = template.replace(/^'(.*)'$/, '$1');
      } else if (template.startsWith('"')) {
        // eslint-disable-next-line no-param-reassign
        template = template.replace(/^"(.*)"$/, '$1');
      }
    }
    const ret = [];
    try {
      ret.push(
        template.replace(
          /((?:[^\\]|^)(?:\\\\)*)\$\{([^}]+)\}/g,
          (_, prefix, val) => {
            if (!(val in themes[defaultMode]) && !reported.includes(val)) {
              throw new ReferenceError(`Unknown theme property: ${val}`);
            } else {
              return `${prefix}${themes[defaultMode][val]}`;
            }
          },
        ),
      );
    } catch (err) {
      printSource(mixin, err);
    }
    ret.push(
      template.replace(
        /((?:[^\\]|^)(?:\\\\)*)\$\{([^}]+)\}/g,
        (_, prefix, val) => `${prefix}var(--${val})`,
      ),
    );
    return {
      [prop]: ret,
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
    [
      'postcss-custom-media',
      {
        preserve: false,
        importFrom: 'src/style/breakpoints.css',
      },
    ],
    'tailwindcss',
    'postcss-preset-env',
  ],
};
