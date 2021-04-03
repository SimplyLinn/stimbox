import classnames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import HeadCog from '../HeadCog';
import styles from './layout.module.css';
import ThemeSwitcher from './ThemeSwitcher';

interface Props {
  isBox?: boolean;
}

export default function Header({ isBox }: Props): JSX.Element {
  const [visible, setVisible] = useState(true);
  const toggleVisible = useCallback(() => setVisible((old) => !old), []);
  return (
    <>
      <header
        className={classnames(styles.header, isBox && !visible && 'hide')}
      >
        <div className={styles.headerRow}>
          <ThemeSwitcher />
          <div className={styles.headerHome}>
            <Link href="/">
              <a>
                stimbox
                <HeadCog
                  className={classnames(
                    styles.fillerIcon,
                    isBox && styles.fillerIcon_isbox,
                  )}
                  frozen={isBox}
                />
              </a>
            </Link>
          </div>
        </div>
        {isBox ? (
          <nav className={classnames(styles.boxNavControls)}>
            <button
              type="button"
              title="Previous box"
              aria-label="Previous box"
            >
              <i className="fas fa-angle-left" />
            </button>
            <button type="button" title="Random box" aria-label="Random box">
              <i className="fas fa-random" />
            </button>
            <button type="button" title="Next box" aria-label="Next box">
              <i className="fas fa-angle-right" />
            </button>
          </nav>
        ) : (
          <nav className={classnames(styles.boxNavControls)}>
            What is Stimbox
          </nav>
        )}
      </header>
      {isBox && (
        <button
          className={classnames(styles.headerShow)}
          type="button"
          onClick={toggleVisible}
          title={visible ? 'Hide header' : 'Show header'}
          aria-label={visible ? 'Hide header' : 'Show header'}
        >
          <i
            className={classnames('fas', visible ? 'fa-eye-slash' : 'fa-eye')}
          />
        </button>
      )}
    </>
  );
}
