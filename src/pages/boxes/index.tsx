import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { MetaData } from 'stimbox';
import getBoxes from 'stimbox/utils/getBoxes';
import Head from 'next/head';
import BoxListItem from 'stimbox/Components/BoxListItem';

import classnames from 'classnames';
import styles from 'stimbox/style/box-list-page.module.css';
import elasticlunr, { Index, SerialisedIndexData } from 'elasticlunr';

type StaticProps = {
  boxes: readonly MetaData[];
  serialisedIndexData: SerialisedIndexData<Fields>;
};
interface Fields {
  id: number;
  name: string;
  description: string;
}

function getIndex(serialisedData?: SerialisedIndexData<Fields>) {
  if (serialisedData == null) {
    return elasticlunr<Fields>(function config() {
      this.addField('id');
      this.addField('name');
      this.addField('description');
    });
  }
  return Index.load(serialisedData);
}

const DEBOUNCE_TIME = 500;

interface SearchFieldProps {
  serialisedIndexData: StaticProps['serialisedIndexData'];
  boxes: StaticProps['boxes'];
  setBoxList: React.Dispatch<React.SetStateAction<readonly MetaData[]>>;
}

function SearchField({
  serialisedIndexData,
  boxes,
  setBoxList,
}: SearchFieldProps): JSX.Element {
  const index = useMemo(() => getIndex(serialisedIndexData), [
    serialisedIndexData,
  ]);
  const [setSearchText, updateSearchTextCb] = useState([
    (_: string) => {},
  ] as const);
  const [forceSearch, updateForceSearchCb] = useState([
    (_: string) => {},
  ] as const);
  useEffect(() => {
    let timeout: number | null = null;
    let lastSearch = '';
    function flush(text: string) {
      if (timeout != null) {
        clearTimeout(timeout);
        timeout = null;
      }
      if (text === lastSearch) return;
      if (text === '') {
        setBoxList(boxes);
      } else {
        setBoxList(
          index
            .search(text, {
              fields: { name: { boost: 2 }, description: { boost: 1 } },
            })
            .map(({ ref }) => boxes[Number.parseInt(ref, 10)]),
        );
      }
      lastSearch = text;
    }
    function newText(text: string) {
      if (timeout != null) clearTimeout(timeout);
      timeout = setTimeout(flush, DEBOUNCE_TIME, text);
    }
    updateSearchTextCb([newText]);
    updateForceSearchCb([flush]);
    return () => {
      updateSearchTextCb([() => {}]);
      updateForceSearchCb([() => {}]);
      if (timeout != null) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
  }, [boxes, index, setBoxList]);
  return (
    <div className={styles.searchInputWrapper}>
      <i className="fas fa-search" />
      <input
        type="text"
        onChange={(ev) => setSearchText[0](ev.currentTarget.value)}
        onBlur={(ev) => forceSearch[0](ev.currentTarget.value)}
        onKeyDown={(ev) =>
          ev.key === 'Enter' &&
          !ev.shiftKey &&
          forceSearch[0](ev.currentTarget.value)
        }
        placeholder="Search..."
      />
    </div>
  );
}

const Box: NextPage<StaticProps> = ({
  boxes,
  serialisedIndexData,
}: StaticProps) => {
  const [showFilter, setFilter] = useState(false);
  const toggleFilter = useCallback(() => {
    setFilter((old) => !old);
  }, [setFilter]);
  const [boxList, setBoxList] = useState(boxes);

  return (
    <div className={styles.root}>
      <Head>
        <title>Boxlist | Stimbox</title>
      </Head>
      <form className={styles.searchWrapper}>
        <div className={styles.search}>
          <SearchField
            setBoxList={setBoxList}
            boxes={boxes}
            serialisedIndexData={serialisedIndexData}
          />
          <button type="button" onClick={toggleFilter} className="hover">
            <i className="fas fa-filter" />
          </button>
        </div>
        <fieldset className={classnames(styles.filter, !showFilter && 'hide')}>
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
        {boxList.map((box) => (
          <BoxListItem key={box.moduleName} box={box} />
        ))}
      </div>
    </div>
  );
};

export default Box;

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const boxes = await getBoxes();
  const index = getIndex();
  boxes.forEach(({ name, description }, id) => {
    index.addDoc({
      id,
      name,
      description,
    });
  });
  const serialisedIndexData = index.toJSON();
  return {
    props: {
      boxes,
      serialisedIndexData,
    },
  };
};
