/* eslint-disable @typescript-eslint/no-var-requires */
const resolveConfig = require('tailwindcss/resolveConfig');
const fs = require('fs');
const path = require('path');
const tailwindConfig = require('./tailwind.config');

fs.writeFileSync(
  path.join(__dirname, '.resolvedTailwindConfig.json'),
  JSON.stringify(resolveConfig(tailwindConfig)),
);
