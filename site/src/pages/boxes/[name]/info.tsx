import { GetStaticProps, GetStaticPaths } from 'next';
import { MetaData } from 'stimbox';
import React from 'react';
import getBoxes from 'stimbox/utils/getBoxes';
import Page from 'stimbox/Components/Layout/Page';
import Link from 'next/link';

type StaticProps = {
  metadata: MetaData;
};
export default function Info({ metadata }: StaticProps): JSX.Element {
  return (
    <Page title={`${metadata.name} - Info`}>
      <Link href={`/boxes/${encodeURIComponent(metadata.pathId)}`}>
        <a>Go stim with {metadata.name}</a>
      </Link>
      <h2>Description</h2>
      <p>{metadata.longDescription || metadata.shortDescription}</p>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const name = context?.params?.name;
  const metadata = (await getBoxes()).find((meta) => meta.pathId === name);
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
        name: box.pathId,
      },
    })),
    fallback: false, // See the "fallback" section below
  };
};
