function pathToPriority(path) {
  if (path === '/') {
    return '0.7';
  }
  if (path === '/modified-worktree') {
    return '0.0';
  }
  if (path.startsWith('/box/')) {
    if (path.endsWith('/info')) {
      return '0.9';
    }
    return '0.7';
  }
  return null;
}
module.exports = {
  siteUrl: 'https://stimbox.space',
  sourceDir: 'site/.next',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  outDir: 'dist',
  priority: '0.5',
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  transform(config, path) {
    const overridePriority = pathToPriority(path);
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: overridePriority != null ? overridePriority : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
