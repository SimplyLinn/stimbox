import { useThemeConfig } from 'boxd';
import { useCallback } from 'react';
import classnames from 'classnames';

const Header = (): JSX.Element => {
  const conf = useThemeConfig();
  const setLightMode = useCallback(() => {
    document.body.classList.toggle('light-theme');
    document.body.classList.remove('dark-theme');
  }, []);
  const setAutoMode = useCallback(() => {
    document.body.classList.remove('light-theme');
    document.body.classList.remove('dark-theme');
  }, []);
  const setDarkMode = useCallback(() => {
    document.body.classList.remove('light-theme');
    document.body.classList.toggle('dark-theme');
  }, []);
  return (
    <div className="layout-theme-switcher">
      <button
        type="button"
        className={classnames(
          conf.override && conf.theme === 'light' && 'active',
        )}
        onClick={setLightMode}
      >
        <i className="fas fa-sun"></i>
      </button>{' '}
      <button
        type="button"
        className={classnames(!conf.override && 'active')}
        onClick={setAutoMode}
      >
        <i className="fas fa-adjust"></i>
      </button>{' '}
      <button
        type="button"
        className={classnames(
          conf.override && conf.theme === 'dark' && 'active',
        )}
        onClick={setDarkMode}
      >
        <i className="fas fa-moon"></i>
      </button>
    </div>
  );
};

export default Header;
