import classnames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface Props {
  isBox?: boolean;
}

const Header = ({ isBox }: Props): JSX.Element => {
  const [visible, setVisible] = useState(true);
  const toggleVisible = useCallback(() => setVisible((old) => !old), []);
  return (
    <>
      <header
        className={classnames('layout-header', isBox && !visible && 'hide')}
      >
        <ThemeSwitcher />
        <div className="layout-header-home">
          <Link href="/">
            <a>stimbox.space</a>
          </Link>
        </div>
        {isBox && (
          <nav
            className={classnames(
              'layout-box-nav-controls',
              !visible && 'hide',
            )}
          >
            <button type="button">
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button type="button">
              <i className="fas fa-angle-left"></i>
            </button>
            <button type="button">
              <i className="fas fa-random"></i>
            </button>
            <button type="button">
              <i className="fas fa-angle-right"></i>
            </button>
            <button type="button" onClick={toggleVisible} className="hover">
              <i className="fas fa-eye-slash"></i>
            </button>
          </nav>
        )}
      </header>
      {isBox && (
        <button
          className={classnames('layout-header-show', visible && 'hide')}
          type="button"
          onClick={toggleVisible}
        >
          <i className="fas fa-eye"></i>
        </button>
      )}
    </>
  );
};

export default Header;
