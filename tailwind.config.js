const colors = {
  lighter: 'rgb(242, 244, 248)',
  lightish: '#eceff4',
  light: '#e6e6e6',
  'light-fade': 'rgba(255, 255, 255, 0.8)',
  'dark-fade': 'rgba(0, 0, 0, 0.8)',
  dark: '#2e3440',
  darker: 'rgb(36, 41, 51)',
  grey: '#3b4252',
  'grey-dark': '#2e3440',
  'grey-light': '#4c566a',
  purple: '#b39ddb',
  'purple-lighter': '#e6ceff',
  'purple-light': '#cfb7ff',
  'purple-dark': '#594c73',
  'purple-darker': '#5a21c4',
  blue: '#90caf9',
  'blue-light': '#c3fdff',
  'blue-dark': '#5d99c6',
  green: '#80cbc4',
  'green-light': '#b2dfdb',
  'green-dark': '#00867d',
};

const dark = {
  back1: colors.darker,
  back2: colors.dark,
  text1: colors.light,
  text2: colors.lighter,
  fade: colors['dark-fade'],

  'color-back': colors['grey-dark'],
  'color-border': 'transparent',
  'color-text': colors.green,
  'color-hover': 'transparent',
  'color-hover-text': colors['green-light'],
  'color-active': colors['green-dark'],
  'color-active-border': 'transparent',

  'control-back': colors['grey-dark'],
  'control-border': 'transparent',
  'control-text': colors.blue,
  'control-hover': 'transparent',
  'control-hover-text': colors['blue-light'],

  'input-back': colors.grey,
  'input-border': 'transparent',

  'button-back': colors['grey-dark'],
  'button-border': 'transparent',
  'button-text': colors.purple,
  'button-hover': 'transparent',
  'button-hover-text': colors['purple-light'],

  'block-back': colors.darker,
  'block-border': 'transparent',

  'link-text': colors.purple,
  'link-active': colors['purple-lighter'],
  ...colors,
};

const light = {
  back1: colors.lightish,
  back2: colors.lighter,
  text1: colors.darker,
  text2: colors.dark,
  fade: colors['light-fade'],

  'color-back': colors.lighter,
  'color-border': 'transparent',
  'color-text': colors.green,
  'color-hover': 'transparent',
  'color-hover-text': colors.green,
  'color-active': colors['green-dark'],
  'color-active-border': 'transparent',

  'control-back': colors.light,
  'control-border': 'transparent',
  'control-text': colors.blue,
  'control-hover': 'transparent',
  'control-hover-text': colors['blue-dark'],

  'input-back': colors.light,
  'input-border': 'transparent',

  'button-back': colors.light,
  'button-border': 'transparent',
  'button-text': colors.purple,
  'button-hover': 'transparent',
  'button-hover-text': colors['purple-dark'],

  'block-back': colors.light,
  'block-border': 'transparent',

  'link-text': colors['purple-darker'],
  'link-active': colors['purple-dark'],
  ...colors,
};
const colorModes = {
  dark,
  light,
};

module.exports = {
  purge: [
    './boxes/**/*.ts',
    './boxes/**/*.tsx',
    './boxes/**/*.js',
    './boxes/**/*.jsm',
    './boxes/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './src/**/*.js',
    './src/**/*.jsm',
    './src/**/*.jsx',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif'],
    },
    borderWidth: {
      default: '1px',
      0: '0',
      2: '2px',
      4: '4px',
    },
    extend: {
      colors: {
        cyan: '#9cdbff',
        modes: colorModes,
      },
      spacing: {
        96: '24rem',
        128: '32rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
