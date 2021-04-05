import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface Viewport {
  readonly top: number;
  readonly left: number;
  readonly bottom: number;
  readonly right: number;
  readonly width: number;
  readonly height: number;
}

const defaultState: Viewport = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: 0,
  height: 0,
};

const viewportContext = createContext(defaultState);

interface Props {
  headerRef: HTMLElement | null;
  mainRef: HTMLElement | null;
  footerRef: HTMLElement | null;
}

export default function ViewportContextProvider({
  children,
  mainRef,
  headerRef,
  footerRef,
}: PropsWithChildren<Props>): JSX.Element {
  const [viewport, setViewport] = useState(defaultState);
  const updateRect = useMemo(() => {
    if (mainRef == null || typeof window === 'undefined') {
      return () => setViewport(defaultState);
    }
    const main = mainRef;
    return () => {
      const rects = main.getClientRects();
      if (rects.length < 1) {
        setViewport(defaultState);
        return;
      }
      const [rect] = rects;
      setViewport({
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      });
    };
  }, [mainRef]);
  useEffect(() => {
    if (typeof window === 'undefined') {
      updateRect();
      return undefined;
    }
    function handleResize() {
      updateRect();
    }
    window.addEventListener('resize', handleResize, { passive: true });

    updateRect();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateRect]);
  const [headerObserver, footerObserver] = useMemo(() => {
    if (typeof MutationObserver === 'undefined') return [null, null];
    const header = new MutationObserver(updateRect);
    const footer = new MutationObserver(updateRect);
    return [header, footer];
  }, [updateRect]);
  useEffect(() => {
    if (headerRef == null || headerObserver == null) {
      updateRect();
      return undefined;
    }
    const header = headerRef;
    headerObserver.observe(header, {
      subtree: true,
      characterData: true,
      attributes: true,
    });
    return () => {
      headerObserver.disconnect();
    };
  }, [updateRect, headerRef, headerObserver]);
  useEffect(() => {
    if (footerRef == null || footerObserver == null) {
      updateRect();
      return undefined;
    }
    const footer = footerRef;
    footerObserver.observe(footer, {
      subtree: true,
      characterData: true,
      attributes: true,
    });
    return () => {
      footerObserver.disconnect();
    };
  }, [updateRect, footerRef, footerObserver]);
  return (
    <viewportContext.Provider value={viewport}>
      {children}
    </viewportContext.Provider>
  );
}

export function useViewport(): Viewport {
  return useContext(viewportContext);
}
