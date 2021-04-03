import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { MetaData } from 'stimbox';
import getBoxes from 'stimbox/utils/getBoxes';
import BoxListItem from 'stimbox/Components/BoxListItem';

import classnames from 'classnames';
import styles from 'stimbox/style/box-list-page.module.css';
import elasticlunr, { Index, SerialisedIndexData } from 'elasticlunr';
import useInitialRender from 'stimbox/hooks/useInitialRender';

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

function search(
  index: elasticlunr.Index<Fields>,
  boxes: StaticProps['boxes'],
  text: string,
) {
  if (text === '') return boxes;
  return index
    .search(text, {
      fields: { name: { boost: 2 }, description: { boost: 1 } },
    })
    .map(({ ref }) => boxes[Number.parseInt(ref, 10)]);
}

function SearchField({
  serialisedIndexData,
  boxes,
  setBoxList,
}: SearchFieldProps): JSX.Element {
  const index = useMemo(() => getIndex(serialisedIndexData), [
    serialisedIndexData,
  ]);
  const initialRender = useInitialRender();
  const [inputText, setInputText] = useState('');
  useEffect(() => {
    if (initialRender) return;
    const searchText = window.location.hash.startsWith('#search?')
      ? decodeURIComponent(window.location.hash.substr(8))
      : '';
    setInputText(searchText);
    setBoxList(search(index, boxes, searchText));
  }, [boxes, index, initialRender, setBoxList]);
  const [setSearchText, updateSearchTextCb] = useState([
    (_: string) => {},
  ] as const);
  const [forceSearch, updateForceSearchCb] = useState([
    (_: string) => {},
  ] as const);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let timeout: number | null = null;
    let lastSearch = window.location.hash.startsWith('#search?')
      ? decodeURIComponent(window.location.hash.substr(8))
      : '';
    function flush(text: string) {
      if (timeout != null) {
        clearTimeout(timeout);
        timeout = null;
      }
      if (text === lastSearch) return;
      if (text === '') {
        setBoxList(boxes);
      } else {
        setBoxList(search(index, boxes, text));
      }
      lastSearch = text;
      const href = window.location.href.split('#', 1)[0];
      const asPath = window.history.state.as.split('#', 1)[0];
      const newState = {
        ...window.history.state,
        as:
          text !== '' ? `${asPath}#search?${encodeURIComponent(text)}` : asPath,
      };
      window.history.replaceState(
        newState,
        document.title,
        text !== '' ? `${href}#search?${encodeURIComponent(text)}` : href,
      );
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
        value={inputText}
        onChange={(ev) => {
          setInputText(ev.currentTarget.value);
          setSearchText[0](ev.currentTarget.value);
        }}
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
      <form className={styles.searchWrapper}>
        <div className={styles.search}>
          <SearchField
            setBoxList={setBoxList}
            boxes={boxes}
            serialisedIndexData={serialisedIndexData}
          />
          <button
            type="button"
            onClick={toggleFilter}
            className="hover"
            aria-label="Toggle filters"
            title="Toggle filters"
          >
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
