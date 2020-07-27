import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import classnames from 'classnames';
import dynamic from 'next/dynamic';
import { MetaData } from 'boxd';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import Header from 'Components/Layout/Header';
import AsButton from 'Components/AsButton';
import getBoxes from 'utils/getBoxes';

const StimLoading = () => (
  <div>
    <noscript>You need JavaScript enabled to use StimBox</noscript>
  </div>
);

type StaticProps = {
  metadata: MetaData;
};
const Box: NextPage<StaticProps> = ({ metadata }: StaticProps) => {
  const [headerOpen, setHeaderOpen] = useState(true);
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
    <div className="boxlayout">
      <Head>
        <title>{metadata.name} | Stimbox</title>
      </Head>
      <header className={classnames('boxlayout-header', !headerOpen && 'closed')}>
        <Header />
        <AsButton onTrigger={() => setHeaderOpen((old) => !old)}>
          <span className="boxlayout-header-button" />
        </AsButton>
      </header>
      <main className="boxlayout-main">
        {metadata.name}
        <Component />
      </main>
    </div>
  );
};

export default Box;

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const name = context?.params?.name;
  const metadata = (await getBoxes()).find((meta) => meta.moduleName === name);
  if (!metadata) throw new Error('Box not found');
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
