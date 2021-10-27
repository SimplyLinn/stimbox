/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const execa = require('execa');
const path = require('path');
const fs = require('fs');

const binPath = require.resolve('.bin/babel');
const modulePath = path.join(__dirname, '..', 'node_modules');

const boxDir = __dirname;

function hasMeta(module) {
  try {
    return fs.statSync(path.join(boxDir, module, 'meta.json')).isFile();
  } catch {
    return false;
  }
}

const boxes = fs
  .readdirSync(boxDir, { withFileTypes: true })
  .map((dir) => {
    if (!dir.name.startsWith('.') && dir.isDirectory() && hasMeta(dir.name)) {
      return dir.name;
    }
    return null;
  })
  .filter((s) => s != null);

function copyFolderRecursiveSync(source, target, depth = 0) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder, depth + 1);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}

(async () => {
  await Promise.all(
    boxes.map(async (box) => {
      const boxesPath = path.join(modulePath, '@boxes');
      const boxPath = path.join(boxesPath, box, 'dist');
      const boxDistPath = path.join(boxesPath, box, 'dist');
      try {
        fs.statSync(boxDistPath);
        fs.rmSync(boxDistPath, { recursive: true, force: true });
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
      fs.mkdirSync(boxPath, { recursive: true });
      await execa(binPath, [
        '--config-file',
        path.join(__dirname, 'babel.config.json'),
        '-x',
        '.js,.ts,.jsx,.tsx,.es6,.es,.mjs,.cjs',
        '--delete-dir-on-start',
        '-d',
        boxDistPath,
        path.join(boxDir, box, 'src'),
      ]);
      // npm does symlinks, yarn does copy on install.
      // symlink already has dist, copy needs another copy.
      try {
        fs.statSync(boxDistPath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          copyFolderRecursiveSync(boxDistPath, boxPath);
        }
        throw err;
      }
      // eslint-disable-next-line no-console
      console.log(`${box} built!`);
    }),
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
