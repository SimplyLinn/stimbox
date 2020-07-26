import { NextPage, GetStaticProps } from 'next';
import { MetaData } from 'boxd';
import Link from 'next/link';
import Layout from 'Components/Layout';
import getBoxes from 'utils/getBoxes';
import Head from 'next/head';

type StaticProps = {
  boxes: readonly MetaData[];
};

const Box: NextPage<StaticProps> = ({ boxes }: StaticProps) => {
  return (
    <Layout>
      <Head>
        <title>Boxlist | Stimbox</title>
      </Head>
      {boxes.map((box) => (
        <div key={box.moduleName}>
          <Link
            href={`/boxes/[name]?name=${encodeURIComponent(box.moduleName)}`}
            as={`/boxes/${encodeURIComponent(box.moduleName)}`}
          >
            <a>{box.name}</a>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export default Box;

export const getStaticProps: GetStaticProps = async () => {
  const boxes = await getBoxes();
  return {
    props: {
      boxes,
    },
  };
};
