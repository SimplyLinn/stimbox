import { useThemeConfig } from 'stimbox';
import { useCallback } from 'react';
import classnames from 'classnames';
import styles from './layout.module.css';

export default function ThemeSwitcher(): JSX.Element {
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
    <div className={styles.themeSwitcher}>
      <button
        type="button"
        className={classnames(
          conf.override && conf.theme === 'light' && 'active',
        )}
        onClick={setLightMode}
      >
        <i className="fas fa-sun" />
      </button>{' '}
      <button
        type="button"
        className={classnames(!conf.override && 'active')}
        onClick={setAutoMode}
      >
        <i className="fas fa-adjust" />
      </button>{' '}
      <button
        type="button"
        className={classnames(
          conf.override && conf.theme === 'dark' && 'active',
        )}
        onClick={setDarkMode}
      >
        <i className="fas fa-moon" />
      </button>
    </div>
  );
}
