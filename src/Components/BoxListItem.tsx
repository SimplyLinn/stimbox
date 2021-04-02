import React, { useCallback, useEffect, useState } from 'react';
import { MetaData } from 'stimbox';
import classnames from 'classnames';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';

import styles from 'stimbox/style/box-list-item.module.css';

export default function BoxListItem({ box }: { box: MetaData }): JSX.Element {
  const [showText, setShowText] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const toggleText = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    setShowText((old) => !old);
  }, []);
  useEffect(() => {
    if (!showText || ref == null) return undefined;
    const clickHandler = (ev: MouseEvent) => {
      if (ev.target instanceof Node && !ref.contains(ev.target)) {
        setShowText(false);
      }
    };
    window.addEventListener('click', clickHandler, { passive: true });
    return () => {
      window.removeEventListener('click', clickHandler);
    };
  }, [showText, ref, setShowText]);
  return (
    <div ref={setRef} className={styles.root}>
      <Link
        href={`/boxes/[name]?name=${encodeURIComponent(box.moduleName)}`}
        as={`/boxes/${encodeURIComponent(box.moduleName)}`}
      >
        <a className={styles.headerLink}>
          <div
            tabIndex={-1}
            className={classnames(
              styles.header,
              box.thumbnail == null && styles.header_nothumb,
            )}
          >
            <h4 title={box.name}>{box.name}</h4>
          </div>
        </a>
      </Link>
      <div className={styles.overlayWrapper}>
        <div className={styles.overlay}>
          {box.thumbnail != null && (
            <img src={box.thumbnail} alt={`Thumbnail for ${box.name}`} />
          )}
          {box.thumbnail == null && (
            <div className={classnames(styles.textWrapper, styles.textOnly)}>
              <SimpleBar autoHide={false} className={styles.text}>
                <p>{box.description}</p>
              </SimpleBar>
            </div>
          )}
          {box.thumbnail != null && (
            <div
              className={classnames(
                styles.textWrapper,
                !showText && styles.textHidden,
              )}
            >
              <SimpleBar autoHide={false} className={styles.text}>
                <p>{box.description}</p>
              </SimpleBar>
            </div>
          )}
        </div>
      </div>
      {box.thumbnail != null && (
        <i
          className={classnames(
            'fas',
            'fa-info-circle',
            'hover',
            showText && styles.active,
          )}
          aria-hidden
          onClick={toggleText}
        />
      )}
    </div>
  );
}
