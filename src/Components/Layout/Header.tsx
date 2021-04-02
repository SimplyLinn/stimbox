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
                stimbox{!isBox && <HeadCog className={styles.fillerIcon} />}
              </a>
            </Link>
          </div>
        </div>
        {isBox && (
          <nav
            className={classnames(styles.boxNavControls, !visible && 'hide')}
          >
            <button type="button">
              <i className="fas fa-angle-double-left" />
            </button>
            <button type="button">
              <i className="fas fa-angle-left" />
            </button>
            <button type="button">
              <i className="fas fa-random" />
            </button>
            <button type="button">
              <i className="fas fa-angle-right" />
            </button>
          </nav>
        )}
      </header>
      {isBox && (
        <button
          className={classnames(styles.headerShow)}
          type="button"
          onClick={toggleVisible}
        >
          <i
            className={classnames('fas', visible ? 'fa-eye-slash' : 'fa-eye')}
          />
        </button>
      )}
    </>
  );
}
