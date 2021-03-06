/**
 * THIS ENTIRE FILE IS AN UGLY HACK!
 * It's only doing something in development mode, and at that point
 * it's just fetching the static files from the individual boxes.
 */
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

function staticFiles(): JSX.Element {
  return <h1>YOU SHOULD NEVER SEE THIS!</h1>;
}

const getServerSideProps: GetServerSideProps<never> | undefined =
  process.env.NODE_ENV === 'development'
    ? async (context) => {
        try {
          const serveStatic = (await import('serve-static')).default;
          const boxName = context.query.name as string;
          const filePath = context.query.file as string[];
          const middleware = serveStatic(
            `boxes/${encodeURIComponent(boxName)}/static`,
            {
              fallthrough: true,
            },
          );
          await new Promise<void>((resolve) => {
            const newUrl = `/${filePath.map(encodeURIComponent).join('/')}`;
            const proxyReq = new Proxy(context.req, {
              get(target, prop, recevier) {
                if (prop === 'url') return newUrl;
                return Reflect.get(target, prop, recevier);
              },
            });
            context.res.once('finish', resolve);
            middleware(proxyReq, context.res, resolve);
          });
          return {
            notFound: true,
          };
        } catch (err) {
          if (err.code === 'MODULE_NOT_FOUND') {
            return {
              notFound: true,
            };
          }
          throw err;
        }
      }
    : undefined;

const getStaticProps: GetStaticProps | undefined =
  process.env.NODE_ENV !== 'development'
    ? async () => {
        return {
          props: {},
        };
      }
    : undefined;

const getStaticPaths: GetStaticPaths | undefined =
  process.env.NODE_ENV !== 'development'
    ? async () => {
        return {
          paths: [],
          fallback: false,
        };
      }
    : undefined;

module.exports = {
  default: staticFiles,
  getServerSideProps,
  getStaticPaths,
  getStaticProps,
};
