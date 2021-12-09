import { NextApiRequest, NextApiResponse } from 'next';

import serveStatic from 'serve-static';
import path from 'path';

export default async function staticBoxFile(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const boxName = req.query.name as string;
  const filePath = req.query.file as string[];
  const pathName = path.resolve('boxes', boxName, 'static');
  const middleware = serveStatic(pathName, {
    fallthrough: false,
  });
  await new Promise<void>((resolve) => {
    const newUrl = `/${filePath.map(encodeURIComponent).join('/')}`;
    const proxyReq = new Proxy(req, {
      get(target, prop, recevier) {
        if (prop === 'url') return newUrl;
        return Reflect.get(target, prop, recevier);
      },
    });
    res.once('finish', resolve);
    middleware(proxyReq, res, (...args) => {
      console.warn('Static file, next called', ...args);
      resolve();
    });
  });
}
