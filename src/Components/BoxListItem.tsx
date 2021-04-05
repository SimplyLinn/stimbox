import React, { useCallback, useEffect, useState } from 'react';
import { MetaData } from 'stimbox';
import classnames from 'classnames';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';

import styles from './BoxListItem.module.css';

export type Props = Pick<
  MetaData,
  'name' | 'moduleName' | 'thumbnail' | 'shortDescription'
>;

export default function BoxListItem({
  name,
  moduleName,
  thumbnail,
  shortDescription,
}: Props): JSX.Element {
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
      <Link href={`/boxes/${encodeURIComponent(moduleName)}`}>
        <a className={styles.headerLink}>
          <div tabIndex={-1} className={classnames(styles.header)}>
            <h4 title={name}>{name}</h4>
          </div>
        </a>
      </Link>
      <div className={styles.overlayWrapper}>
        <div className={styles.overlay}>
          <Link href={`/boxes/${encodeURIComponent(moduleName)}`}>
            <a tabIndex={-1} aria-label={`Thumbnail for ${name}`}>
              <div
                className={classnames(
                  styles.thumbContainer,
                  thumbnail == null && styles.defaultThumb,
                )}
                style={{
                  backgroundImage:
                    thumbnail != null
                      ? `url('${thumbnail}')`
                      : "url('/static-logo.svg')",
                }}
              />
            </a>
          </Link>
          <div
            className={classnames(
              styles.textWrapper,
              !showText && styles.textHidden,
            )}
          >
            <SimpleBar autoHide={false} className={styles.text}>
              <p>{shortDescription}</p>
            </SimpleBar>
            <Link href={`/boxes/${encodeURIComponent(moduleName)}/info`}>
              <a className="text-center">Full information</a>
            </Link>
          </div>
        </div>
      </div>
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
    </div>
  );
}
