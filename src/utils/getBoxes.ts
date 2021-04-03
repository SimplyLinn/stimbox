import { MetaData } from 'stimbox';
import {
  readdir as readdirCb,
  readFile as readFileCb,
  stat as statCb,
  statSync,
  readdirSync,
  readFileSync,
} from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(readdirCb);
const stat = promisify(statCb);
const readFile = promisify(readFileCb);
const boxDir = path.join(__dirname, '..', '..', 'boxes');
let cache: readonly MetaData[] | null = null;

let inFlight: Promise<readonly MetaData[]> | null = null;

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
  const {
    name,
    description,
    thumbnail: rawThumbnail,
    supportStaticRender,
  } = data;
  let thumbnail: string | null = null;
  if (typeof name !== 'string') {
    return parserError(`Could not import ${moduleName}: Missing name`);
  }
  if (typeof description !== 'string') {
    return parserError(`Could not import ${moduleName}: Missing description`);
  }
  if (typeof supportStaticRender !== 'boolean') {
    return parserError(
      `Could not import ${moduleName}: Missing static render support flag`,
    );
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
    supportStaticRender,
  };
}

function fetchBoxesSync(): MetaData[] {
  function hasMeta(module: string): boolean {
    try {
      return statSync(path.join(boxDir, module, 'meta.json')).isFile();
    } catch {
      return false;
    }
  }
  const res = readdirSync(boxDir, { withFileTypes: true })
    .map((dir) => {
      if (!dir.name.startsWith('.') && dir.isDirectory() && hasMeta(dir.name)) {
        if (!module) return null;
        const data = JSON.parse(
          readFileSync(path.join(boxDir, dir.name, 'meta.json'), {
            encoding: 'utf-8',
          }),
        );
        return parseMetadata(data, dir.name);
      }
      return null;
    })
    .filter((dir): dir is MetaData => dir != null)
    .sort(({ moduleName: a }, { moduleName: b }) => {
      if (a === b) return 0;
      return a < b ? -1 : 1;
    });
  return res;
}

async function fetchBoxes(): Promise<readonly MetaData[]> {
  async function hasMeta(module: string): Promise<boolean> {
    try {
      return (await stat(path.join(boxDir, module, 'meta.json'))).isFile();
    } catch {
      return false;
    }
  }

  const res = (
    await Promise.all(
      (
        await readdir(boxDir, {
          withFileTypes: true,
        })
      ).map(async (dir) => {
        if (
          !dir.name.startsWith('.') &&
          dir.isDirectory() &&
          (await hasMeta(dir.name))
        ) {
          if (!module) return null;
          const data = JSON.parse(
            await readFile(path.join(boxDir, dir.name, 'meta.json'), {
              encoding: 'utf-8',
            }),
          );
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
  if (cache != null) return Promise.resolve(cache);
  if (inFlight === null) {
    inFlight = fetchBoxes()
      .then((res) => {
        if (cache == null) cache = res;
        return cache;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export function getBoxesSync(): readonly MetaData[] {
  if (cache === null) {
    cache = fetchBoxesSync();
  }
  return cache;
}
