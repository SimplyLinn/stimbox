import classnames from 'classnames';
import Link from 'next/link';
import React, { forwardRef, useCallback, useState } from 'react';
import HeadCog from '../HeadCog';
import styles from './layout.module.css';
import ThemeSwitcher from './ThemeSwitcher';

interface Props {
  isBox?: boolean;
}

// eslint-disable-next-line react/prop-types
const Header = forwardRef<HTMLElement, Props>(({ isBox }, ref) => {
  const [visible, setVisible] = useState(true);
  const toggleVisible = useCallback(() => setVisible((old) => !old), []);
  return (
    <>
      <header
        className={classnames(styles.header, isBox && !visible && 'hide')}
        ref={ref}
      >
        <div className={styles.headerRow}>
          <ThemeSwitcher />
          <div className={styles.headerHome}>
            <Link href="/">
              <a>
                Stimbox
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
          <div className={classnames(styles.aboutLink)}>
            <Link href="/about">
              <a>What is Stimbox</a>
            </Link>
          </div>
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
});

export default Header;
