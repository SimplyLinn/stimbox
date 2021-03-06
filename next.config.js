/* eslint-disable */
// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Git = require('nodegit');
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('./tailwind.config');

const resolvedTailwindConfig = resolveConfig(tailwindConfig);


module.exports = {
  // Workaround for console error on every pageload
  trailingSlash: true,
  assetPrefix: '',
  future: {
    webpack5: true,
  },
  publicRuntimeConfig: {
    resolvedTailwindConfig,
  },
  generateBuildId: async () => {
    try {
      const repo = await Git.Repository.open(__dirname);
      const head = await repo.getHeadCommit();
      const hash = head.sha();
      const tree = await head.getTree();
      const clean = (await Git.Diff.treeToWorkdirWithIndex(repo, tree, null)).numDeltas() === 0;
      return `GIT-${hash.replace(/ad/g, 'NO')}${clean ? '' : '-DIRTY'}`
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  reactStrictMode: true,
  webpack: (config, { dev, webpack, buildId }) => {
    // Perform customizations to webpack config
    // console.log(dev, buildId);
    // console.log(config.module.rules, dev);
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_BUILD_ID': JSON.stringify(buildId),
        'process.env.NEXT_BUILT_AT': webpack.DefinePlugin.runtimeValue(Date.now, true),
      }),
    );
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.loader === 'babel-loader') {
        rule.options.cacheDirectory = false;
      }
      return rule;
    });
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }
    // Important: return the modified config
    if (config.node == null) {
      config.node = {};
    }
    config.node.__filename = true;
    config.node.__dirname = true;
    config.externals = config.externals || [];
    config.externals.push('serve-static');
    return config;
  },
};
