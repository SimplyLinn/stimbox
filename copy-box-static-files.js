/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

function copyFileSync(source, target) {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
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
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

const boxesDist = path.join(__dirname, 'dist', 'boxes');
const boxesSrc = path.join(__dirname, 'boxes');
const boxes = fs.readdirSync(boxesDist, { withFileTypes: true });
boxes.forEach((box) => {
  if (!box.isDirectory()) return;
  const subDir = fs.readdirSync(path.join(boxesDist, box.name), {
    withFileTypes: true,
  });
  const distBoxDir = path.join(boxesDist, box.name);
  const srcStaticDir = path.join(boxesSrc, box.name, 'static');
  if (
    !subDir.some((ent) => ent.isDirectory() && ent.name === 'info') ||
    !subDir.some((ent) => ent.isFile() && ent.name === 'index.html') ||
    subDir.some((ent) => ent.isDirectory() && ent.name === 'static')
  ) {
    return;
  }
  try {
    if (!fs.statSync(srcStaticDir).isDirectory()) return;
    copyFolderRecursiveSync(srcStaticDir, distBoxDir);
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
});
