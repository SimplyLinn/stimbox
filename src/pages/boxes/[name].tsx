import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';
import { MetaData } from 'boxd';
import React, { useMemo } from 'react';
import Head from 'next/head';
import getBoxes from 'utils/getBoxes';
import Layout from 'Components/Layout';

const StimLoading = () => (
  <div>
    <noscript>You need JavaScript enabled to use StimBox</noscript>
  </div>
);

type StaticProps = {
  metadata: MetaData;
};
const Box: NextPage<StaticProps> = ({ metadata }: StaticProps) => {
  const Component = useMemo(
    () =>
      dynamic(
        () =>
          import(
            /* webpackInclude: /[\/\\]boxes[\/\\][^\/\\]+[\/\\]index\.(js|jsm|jsx|ts|tsx)$/ */
            /* webpackChunkName: "box-[request]" */
            /* webpackMode: "lazy" */
            `../../../boxes/${metadata.moduleName}`
          ),
        {
          loading: StimLoading,
          ssr: false,
        },
      ),
    [metadata.moduleName],
  );
  return (
    <Layout isBox>
      <Head>
        <title>{metadata.name} | Stimbox</title>
      </Head>
      <Component />
    </Layout>
  );
};

export default Box;

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const name = context?.params?.name;
  const metadata = (await getBoxes()).find((meta) => meta.moduleName === name);
  if (!metadata) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      metadata,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const boxes = await getBoxes();
  return {
    paths: boxes.map((box) => ({
      params: {
        name: box.moduleName,
      },
    })),
    fallback: false, // See the "fallback" section below
  };
};
