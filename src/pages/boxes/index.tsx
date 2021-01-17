import { NextPage, GetStaticProps } from 'next';
import { MetaData } from 'boxd';
import Layout from 'Components/Layout';
import getBoxes from 'utils/getBoxes';
import Head from 'next/head';
import BoxListItem from 'Components/BoxListItem';
import { useCallback, useState } from 'react';
import classnames from 'classnames';
import styles from '../../style/box-list-page.module.css';

type StaticProps = {
  boxes: readonly MetaData[];
};

const Box: NextPage<StaticProps> = ({ boxes }: StaticProps) => {
  const [showFilter, setFilter] = useState(false);
  const toggleFilter = useCallback(() => {
    setFilter((old) => !old);
  }, [setFilter]);
  return (
    <Layout>
      <Head>
        <title>Boxlist | Stimbox</title>
      </Head>
      <div className={styles.root}>
        <form className={styles.searchWrapper}>
          <div className={styles.search}>
            <input type="text" placeholder="Search..." />
            <button type="button" onClick={toggleFilter} className="hover">
              <i className="fas fa-filter"></i>
            </button>
            <button type="button" className="hover">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <fieldset
            className={classnames(styles.filter, !showFilter && 'hide')}
          >
            <legend>Advanced filters</legend>
            <div className={styles.fieldset}>
              <label htmlFor="attr1">Attribute 1</label>
              <input type="text" id="attr1" />
            </div>
            <div className={styles.fieldset}>
              <label htmlFor="attr2">Attribute 2</label>
              <input type="text" id="attr2" />
            </div>
            <div className={styles.fieldset}>
              <label htmlFor="attr3">Attribute 3</label>
              <input type="text" id="attr3" />
            </div>
          </fieldset>
        </form>
        <div className={styles.grid}>
          {boxes.map((box) => (
            <BoxListItem key={box.moduleName} box={box} />
          ))}
        </div>
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
