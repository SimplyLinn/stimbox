import { useThemeConfig } from 'boxd';
import { useEffect, useState } from 'react';
import classnames from 'classnames';
import AsButton from './AsButton';

const Header = (): JSX.Element => {
  const conf = useThemeConfig();
  const [oldConf, setOldConf] = useState<typeof conf | null>(null);
  useEffect(() => {
    return setOldConf(conf);
  }, [conf]);
  return (
    <div className="theme-switcher-outer">
      <AsButton
        onTrigger={() => {
          document.body.classList.remove('light-theme');
          document.body.classList.toggle('dark-theme');
        }}
      >
        <span className="theme-switcher-button theme-switcher-button_dark">
          dark
        </span>
      </AsButton>
      <div className="theme-switcher-wrapper">
        <AsButton
          onTrigger={() => {
            document.body.classList.remove('light-theme');
            document.body.classList.remove('dark-theme');
          }}
        >
          <span className="theme-switcher-button theme-switcher-button_auto">
            auto
          </span>
        </AsButton>
        <div
          className={classnames(
            'theme-switcher',
            `theme-switcher_${!conf.override ? 'auto' : conf.theme}`,
            oldConf &&
              `theme-switcher_from_${
                !oldConf.override ? 'auto' : oldConf.theme
              }`,
          )}
        >
          <span className="theme-switcher-dot" />
        </div>
      </div>

      <AsButton
        onTrigger={() => {
          document.body.classList.toggle('light-theme');
          document.body.classList.remove('dark-theme');
        }}
      >
        <span className="theme-switcher-button theme-switcher-button_light">
          light
        </span>
      </AsButton>
    </div>
  );
};

export default Header;
