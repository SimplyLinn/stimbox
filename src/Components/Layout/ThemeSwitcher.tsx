import { useThemeConfig } from 'stimbox';
import { useCallback } from 'react';
import classnames from 'classnames';
import styles from './ThemeSwitcher.module.css';

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
    <div className={styles.root}>
      <button
        type="button"
        className={classnames(
          conf.override && conf.theme === 'light' && styles.active,
        )}
        onClick={setLightMode}
        aria-label="Light theme"
        title="Light theme"
      >
        <i className="fas fa-sun" />
      </button>{' '}
      <button
        type="button"
        className={classnames(!conf.override && styles.active)}
        onClick={setAutoMode}
        aria-label="Select theme automatically"
        title="Select theme automatically"
      >
        <i className="fas fa-adjust" />
      </button>{' '}
      <button
        type="button"
        className={classnames(
          conf.override && conf.theme === 'dark' && styles.active,
        )}
        onClick={setDarkMode}
        aria-label="Dark theme"
        title="Dark theme"
      >
        <i className="fas fa-moon" />
      </button>
    </div>
  );
}
