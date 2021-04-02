import { MetaData } from 'stimbox';
import { readdir as readdirCb, stat as statCb } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(readdirCb);
const stat = promisify(statCb);

let cache: Promise<readonly MetaData[]> | null = null;

function validateType(data: unknown): data is Partial<Record<string, unknown>> {
  if (typeof data !== 'object' || data == null || Array.isArray(data)) {
    return false;
  }
  return true;
}

class InvalidMetadataError extends Error {
  name = InvalidMetadataError.name;
}

function parserError(message: string, fatal = true): void {
  const error = new InvalidMetadataError(message);
  if (process.env.NODE_ENV === 'development' || !fatal) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    throw error;
  }
}

function parseMetadata(data: unknown, moduleName: string): MetaData | void {
  if (!validateType(data)) {
    return parserError(
      `Could not import ${moduleName}: Invalid type of imported json`,
    );
  }
  const { name, description, thumbnail: rawThumbnail } = data;
  let thumbnail: string | null = null;
  if (typeof name !== 'string') {
    return parserError(`Could not import ${moduleName}: Missing name`);
  }
  if (typeof description !== 'string') {
    return parserError(`Could not import ${moduleName}: Missing description`);
  }
  if (rawThumbnail != null && typeof rawThumbnail !== 'string') {
    parserError(`Invalid thumbnail for ${moduleName}`);
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
  const boxPath = path.join(__dirname, '..', '..', 'boxes');

  async function hasMeta(module: string): Promise<boolean> {
    try {
      return (await stat(path.join(boxPath, module, 'meta.json'))).isFile();
    } catch {
      return false;
    }
  }

  const res = (
    await Promise.all(
      (
        await readdir(boxPath, {
          withFileTypes: true,
        })
      ).map(async (dir) => {
        if (
          !dir.name.startsWith('.') &&
          dir.isDirectory() &&
          (await hasMeta(dir.name))
        ) {
          if (!module) return null;
          const data = await import(`../../boxes/${dir.name}/meta.json`);
          return parseMetadata(data, dir.name);
        }
        return null;
      }),
    )
  )
    .filter((dir): dir is MetaData => dir != null)
    .sort(({ moduleName: a }, { moduleName: b }) => {
      if (a === b) return 0;
      return a < b ? -1 : 1;
    });
  return res;
}

export default function getBoxes(): Promise<readonly MetaData[]> {
  if (cache === null) {
    cache = fetchBoxes();
  }
  return cache;
}
