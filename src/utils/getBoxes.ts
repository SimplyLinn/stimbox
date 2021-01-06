import { MetaData } from 'boxd';

let cache: Promise<readonly MetaData[]> | null = null;

function validateType(data: unknown): data is Record<string, unknown> {
  if (typeof data !== 'object' || data == null || Array.isArray(data)) {
    return false;
  }
  return true;
}

function parseMetadata(data: unknown, moduleName: string): MetaData | null {
  if (!validateType(data)) {
    console.error(
      `Could not import ${moduleName}: Invalid type of imported json`,
    );
    return null;
  }
  const { name, description, thumbnail: rawThumbnail } = data;
  let thumbnail: string | null = null;
  if (typeof name !== 'string') {
    console.error(`Could not import ${moduleName}: Missing name`);
    return null;
  }
  if (typeof description !== 'string') {
    console.error(`Could not import ${moduleName}: Missing description`);
    return null;
  }
  if (rawThumbnail != null && typeof rawThumbnail !== 'string') {
    console.error(`Invalid thumbnail for ${moduleName}`);
  } else if (typeof rawThumbnail === 'string') {
    thumbnail = rawThumbnail;
  }
  return {
    name,
    moduleName,
    description,
    thumbnail,
  };
}

async function fetchBoxes(): Promise<readonly MetaData[]> {
  const fs = await import('fs');
  const path = await import('path');
  const boxPath = path.join(__dirname, '..', '..', 'boxes');

  function hasMeta(module: string): boolean {
    try {
      return fs.statSync(path.join(boxPath, module, 'meta.json')).isFile();
    } catch {
      return false;
    }
  }

  const res = (
    await Promise.all(
      fs
        .readdirSync(boxPath, {
          withFileTypes: true,
        })
        .map((dir) => {
          if (
            !dir.name.startsWith('.') &&
            dir.isDirectory() &&
            hasMeta(dir.name)
          ) {
            if (!module) return null;
            return import(
              `../../boxes/${dir.name}/meta.json`
            ).then((data: unknown) => parseMetadata(data, dir.name));
          }
          return null;
        }),
    )
  ).filter((dir): dir is MetaData => dir != null);
  return res;
}

export default function getBoxes(): Promise<readonly MetaData[]> {
  if (cache === null) {
    cache = fetchBoxes();
  }
  return cache;
}
