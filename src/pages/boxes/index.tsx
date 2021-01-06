import { NextPage, GetStaticProps } from 'next';
import { MetaData } from 'boxd';
import Layout from 'Components/Layout';
import getBoxes from 'utils/getBoxes';
import Head from 'next/head';
import BoxListItem from 'Components/BoxListItem';
import styles from '../../style/box-list-page.module.css';

type StaticProps = {
  boxes: readonly MetaData[];
};

const Box: NextPage<StaticProps> = ({ boxes }: StaticProps) => {
  return (
    <Layout>
      <Head>
        <title>Boxlist | Stimbox</title>
      </Head>
      <div className={styles.root}>
        {boxes.map((box) => (
          <BoxListItem key={box.moduleName} box={box} />
        ))}
      </div>
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
