import dynamic from 'next/dynamic';
import React, { ComponentType, useEffect, useState } from 'react';
import Page from 'stimbox/Components/Layout/Page';
import type { getBoxesSync as GetBoxesSync } from 'stimbox/utils/getBoxes';

const StimLoading = () => {
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const timeout = setTimeout(() => {
      setShowLoading(true);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <Page>
      <noscript>You need JavaScript enabled to use Stimbox.</noscript>
      {showLoading && 'Loading...'}
    </Page>
  );
};

function Failure(): JSX.Element {
  return <Page title="Error">Failed to load the stimbox-component</Page>;
}

const MODULE_PREFIX = '@boxes/';
function importModule(module: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let doImport: () => Promise<any>;
  if (module.startsWith(MODULE_PREFIX)) {
    const boxName = module.substring(MODULE_PREFIX.length);
    doImport = () =>
      import(
        /* webpackExclude: /@boxes\/root(\/.*$)?$/ */
        /* webpackInclude: /dist\/(.*)\.(js|json)$/ */
        /* webpackChunkName: "box-[request]" */
        /* webpackMode: "lazy" */
        `node_modules/@boxes/${boxName}/dist/index.js`
      );
  } else if (process.env.NODE_ENV === 'development') {
    doImport = () =>
      import(
        /* webpackChunkName: "box-[request]" */
        /* webpackMode: "lazy" */
        `../../../boxes/${module}/src/index.tsx`
      );
  } else {
    doImport = () => Promise.reject(new Error('Invalid box module'));
  }
  return dynamic(
    () =>
      doImport().catch((err) => {
        console.error(err);
        return Failure;
      }),
    { ssr: false, loading: StimLoading },
  );
}

const target = {} as Record<string, ComponentType>;

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { getBoxesSync } = require('./getBoxes') as {
    getBoxesSync: typeof GetBoxesSync;
  };
  getBoxesSync().reduce((map, meta) => {
    // eslint-disable-next-line no-param-reassign
    map[meta.moduleName] = importModule(meta.moduleName);
    return map;
  }, target);
}

function assertProp(bMap: typeof target, prop: string | symbol): void {
  if (
    typeof prop === 'string' &&
    !(prop in bMap) &&
    (/^[a-z_-]+$/.test(prop) || /^@boxes\/[a-z_-]+$/.test(prop))
  ) {
    target[prop] = importModule(prop);
  }
}

const boxMap = new Proxy(target, {
  get(bMap, prop, receiver) {
    assertProp(bMap, prop);
    return Reflect.get(bMap, prop, receiver);
  },
  has(bMap, prop) {
    assertProp(bMap, prop);
    return Reflect.has(bMap, prop);
  },
  getOwnPropertyDescriptor(bMap, prop) {
    assertProp(bMap, prop);
    return Reflect.getOwnPropertyDescriptor(bMap, prop);
  },
});

export default boxMap;
