import { GetStaticProps, GetStaticPaths } from 'next';
import { MetaData } from 'stimbox';
import React from 'react';
import getBoxes from 'stimbox/utils/getBoxes';
import boxMap from 'stimbox/utils/boxmap';
import Title from 'stimbox/Components/Title';

type StaticProps = {
  metadata: MetaData;
};
function Box({ metadata }: StaticProps): JSX.Element {
  const Component = boxMap[metadata.moduleName];
  return (
    <>
      <Title>{metadata.name}</Title>
      <Component />
    </>
  );
}
(Box as typeof Box & { isBox?: boolean }).isBox = true;
export default Box;

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
