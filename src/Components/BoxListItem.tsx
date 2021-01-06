import { MetaData } from 'boxd';
import classnames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import SimpleBar from 'simplebar-react';

import styles from '../style/box-list-item.module.css';

export default function BoxListItem({ box }: { box: MetaData }): JSX.Element {
  const [showText, setShowText] = useState(false);
  const toggleText = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    setShowText((old) => !old);
  }, []);
  return (
    <div className={styles.root}>
      <div className={styles.overlayWrapper}>
        <div className={styles.overlay}>
          <Link
            href={`/boxes/[name]?name=${encodeURIComponent(box.moduleName)}`}
            as={`/boxes/${encodeURIComponent(box.moduleName)}`}
          >
            <a>
              {box.thumbnail != null && (
                <img src="https://placekitten.com/320/240" alt="cover photo" />
              )}
              {box.thumbnail == null && (
                <div
                  className={classnames(styles.textWrapper, styles.textOnly)}
                >
                  <SimpleBar autoHide={false} className={styles.text}>
                    <p>{box.description}</p>
                  </SimpleBar>
                </div>
              )}
            </a>
          </Link>
          {box.thumbnail != null && (
            <div
              className={classnames(styles.textWrapper, !showText && 'hide')}
            >
              <SimpleBar autoHide={false} className={styles.text}>
                <p>{box.description}</p>
              </SimpleBar>
            </div>
          )}
        </div>
      </div>
      <Link
        href={`/boxes/[name]?name=${encodeURIComponent(box.moduleName)}`}
        as={`/boxes/${encodeURIComponent(box.moduleName)}`}
      >
        <a
          className={classnames(
            styles.header,
            box.thumbnail == null && styles.header_nothumb,
          )}
        >
          <h4 title={box.name}>{box.name}</h4>
        </a>
      </Link>
      {box.thumbnail != null && (
        <i className="fas fa-info-circle hover" onClick={toggleText} />
      )}
    </div>
  );
}
