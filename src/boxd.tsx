import resolveConfig from 'tailwindcss/resolveConfig';
import { EventEmitter } from 'events';
import { useEffect, useState } from 'react';
import config from '../config.json';
import tailwindConfig from '../tailwind.config';

const { defaultMode } = config;

export type ReadonlyRecord<K extends string | number | symbol, T> = {
  readonly [P in K]: T;
};

export type MetaData = {
  name: string;
  moduleName: string;
  description: string;
  thumbnail?: string | null;
};

const themes: {
  dark: Partial<ReadonlyRecord<string, string>>;
  light: Partial<ReadonlyRecord<string, string>>;
} = resolveConfig(tailwindConfig).theme.colors.modes;

interface Listener {
  readonly trgt: {
    readonly addEventListener: (
      evt: keyof MediaQueryListEventMap,
      cb: unknown,
    ) => void;
    readonly removeEventListener: (
      evt: keyof MediaQueryListEventMap,
      cb: unknown,
    ) => void;
  };
  readonly evt: keyof MediaQueryListEventMap;
  readonly cb: unknown;
}

interface ThemeConfig {
  readonly theme: keyof typeof themes;
  readonly override: boolean;
}

interface ThemeChangedEvent extends ThemeConfig {
  readonly oldTheme: keyof typeof themes;
}

type ThemeEventMap = {
  changed: ThemeChangedEvent;
};

class ThemeSwitcher extends EventEmitter {
  static DEFAULT_CONF: ThemeConfig = {
    theme: defaultMode as keyof typeof themes,
    override: false,
  };

  private browserPreferred = ThemeSwitcher.DEFAULT_CONF.theme;

  private override: keyof typeof themes | null = null;

  private currentTheme: keyof typeof themes = this.browserPreferred;

  private selfListeners: Listener[] = [];

  private observer: MutationObserver | null = null;

  private mergedCustomThemeCache =
    typeof window !== 'undefined' && window.WeakMap != null
      ? new window.WeakMap<
          Partial<Record<string, string>>,
          Partial<Record<string, string>>
        >()
      : {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          get: (() => {}) as WeakMap<
            Partial<Record<string, string>>,
            Partial<Record<string, string>>
          >['get'],
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          set: ((e) => e) as WeakMap<
            Partial<Record<string, string>>,
            Partial<Record<string, string>>
          >['get'],
        };

  private updateCurrentTheme(newOverride?: ThemeSwitcher['override']) {
    const newTheme =
      (newOverride !== undefined ? newOverride : this.override) ??
      this.browserPreferred;
    if (
      newTheme !== this.currentTheme ||
      (newOverride !== undefined && this.override !== newOverride)
    ) {
      const oldOverride = this.override;
      this.override = newOverride === undefined ? oldOverride : newOverride;
      const oldTheme = this.currentTheme;
      this.currentTheme = newTheme;
      this.emit('changed', {
        theme: this.currentTheme,
        oldTheme,
        override: this.override !== null,
      });
    }
  }

  public emit<E extends keyof ThemeEventMap>(
    event: E,
    ev: ThemeEventMap[E],
  ): boolean {
    return super.emit(event, ev);
  }

  public on<E extends keyof ThemeEventMap>(
    event: E,
    listener: (ev: ThemeEventMap[E]) => void,
  ): this {
    return super.on(event, listener);
  }

  constructor() {
    super();
    if (typeof window !== 'undefined') {
      this.override = (Object.keys(
        themes,
      ) as (keyof typeof themes)[]).reduceRight(
        (foundTheme, curTheme) =>
          foundTheme ??
          (document.body.classList.contains(`${curTheme}-theme`)
            ? curTheme
            : null),
        null as ThemeSwitcher['override'],
      );
      this.observer = new MutationObserver((records) => {
        // eslint-disable-next-line no-undef-init
        let newOverride: ThemeSwitcher['override'] | undefined = undefined;
        for (const { target } of records) {
          if (target instanceof HTMLBodyElement) {
            newOverride = (Object.keys(
              themes,
            ) as (keyof typeof themes)[]).reduceRight(
              (foundTheme, curTheme) =>
                foundTheme ??
                (target.classList.contains(`${curTheme}-theme`)
                  ? curTheme
                  : null),
              null as ThemeSwitcher['override'],
            );
          }
        }
        if (typeof newOverride !== 'undefined')
          this.updateCurrentTheme(newOverride);
      });
      this.observer.observe(window.document.body, {
        attributes: true,
        attributeFilter: ['class'],
      });
      const supportsColorScheme =
        window.matchMedia('(prefers-color-scheme)').media !== 'not all';
      if (supportsColorScheme) {
        (Object.keys(themes) as (keyof typeof themes)[]).forEach((key) => {
          const matcher = window.matchMedia(`(prefers-color-scheme: ${key})`);
          if (matcher.matches) {
            this.browserPreferred = key;
            this.currentTheme = this.browserPreferred;
          }
          this.listen(matcher, 'change', ({ matches }) => {
            if (!matches && this.browserPreferred === key) {
              this.browserPreferred = defaultMode as keyof typeof themes;
              setTimeout(() => {
                if (this.browserPreferred === defaultMode) {
                  this.updateCurrentTheme();
                }
              }, 0);
            } else if (matches) {
              this.browserPreferred = key;
              this.updateCurrentTheme();
            }
          });
        });
      }
    }
  }

  /**
   *
   */
  private listen<P extends keyof MediaQueryListEventMap>(
    trgt: {
      addEventListener: (
        evt: P,
        cb: (ev: MediaQueryListEventMap[P]) => void,
      ) => void;
      removeEventListener: (
        evt: P,
        cb: (ev: MediaQueryListEventMap[P]) => void,
      ) => void;
    },
    evt: P,
    cb: (ev: MediaQueryListEventMap[P]) => void,
  ) {
    this.selfListeners.push({
      trgt: trgt as Listener['trgt'],
      evt,
      cb,
    });
    trgt.addEventListener(evt, cb);
  }

  getConfig(): ThemeConfig {
    return {
      theme: this.currentTheme,
      override: this.override !== null,
    };
  }

  getTheme(): Partial<ReadonlyRecord<string, string>> {
    return themes[this.currentTheme];
  }

  getThemeColor(key: string): string | undefined;
  getThemeColor(key: string, def: string): string;
  getThemeColor(key: string, def?: string): string | undefined {
    return this.getTheme()[key] ?? def;
  }

  private getMergedTheme(
    customThemes: Partial<typeof themes>,
  ): Partial<ReadonlyRecord<string, string>> {
    const customTheme = customThemes[this.currentTheme];
    if (customTheme == null) return this.getTheme();
    let cached = this.mergedCustomThemeCache.get(customTheme);
    if (!cached) {
      cached = { ...this.getTheme(), ...customTheme };
      this.mergedCustomThemeCache.set(customTheme, cached);
    }
    return cached;
  }

  getCustomTheme(
    customThemes: Partial<typeof themes>,
  ): Partial<ReadonlyRecord<string, string>>;

  getCustomTheme(
    customThemes: Partial<typeof themes>,
    key: string,
  ): string | undefined;

  getCustomTheme(
    customThemes: Partial<typeof themes>,
    key: string,
    def: string,
  ): string;

  getCustomTheme(
    customThemes: Partial<typeof themes>,
    key?: string,
    def?: string,
  ): string | undefined | Partial<ReadonlyRecord<string, string>> {
    const merged = this.getMergedTheme(customThemes);
    if (typeof key === 'undefined') return merged;
    return merged[key] ?? def;
  }

  getCustomColor(colors: ReadonlyRecord<keyof typeof themes, string>): string;

  getCustomColor(
    colors: Partial<ReadonlyRecord<keyof typeof themes, string>>,
  ): string | undefined;

  getCustomColor(
    colors: Partial<ReadonlyRecord<keyof typeof themes, string>>,
    def: string,
  ): string;

  getCustomColor(
    colors: Partial<ReadonlyRecord<keyof typeof themes, string>>,
    def?: string,
  ): string | undefined {
    return colors[this.currentTheme] ?? def;
  }
}

export const Theme = new ThemeSwitcher();

export function useThemeConfig(): ThemeConfig {
  const [curThemeConf, setCurThemeConf] = useState(ThemeSwitcher.DEFAULT_CONF);
  useEffect(() => {
    setCurThemeConf(Theme.getConfig());
    const handleChange = ({ theme, override }: ThemeChangedEvent) => {
      setCurThemeConf({ theme, override });
    };
    Theme.on('changed', handleChange);
    return () => {
      Theme.off('changed', handleChange);
    };
  }, [setCurThemeConf]);
  return curThemeConf;
}

export function useTheme(): Partial<ReadonlyRecord<string, string>> {
  const [curTheme, setCurTheme] = useState(
    themes[defaultMode as keyof typeof themes],
  );
  useEffect(() => {
    setCurTheme(Theme.getTheme());
    const handleChange = () => {
      setCurTheme(Theme.getTheme());
    };
    Theme.on('changed', handleChange);
    return () => {
      Theme.off('changed', handleChange);
    };
  }, [setCurTheme]);
  return curTheme;
}

export function useThemeColor(key: string): string | undefined;
export function useThemeColor(key: string, def: string): string;
export function useThemeColor(key: string, def?: string): string | undefined {
  return useTheme()[key] ?? def;
}
