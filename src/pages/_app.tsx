import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import 'simplebar/dist/simplebar.min.css';
import 'stimbox/style/index.css';
import styles from 'stimbox/Components/Layout/layout.module.css';
import Head from 'next/head';
import Header from 'stimbox/Components/Layout/Header';
import { initialRenderContext } from 'stimbox/hooks/useInitialRender';
import Footer from 'stimbox/Components/Layout/Footer';
import ViewportContextProvider from 'stimbox/Components/ViewportContextProvider';
import Title from 'stimbox/Components/Title';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [initialRender, setInitialRender] = useState(true);
  const [mainRef, setMainRef] = useState<HTMLElement | null>(null);
  const [headerRef, setHeaderRef] = useState<HTMLElement | null>(null);
  const [footerRef, setFooterRef] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') setInitialRender(false);
  }, []);
  const isBox =
    (Component as typeof Component & { isBox?: boolean }).isBox || false;
  return (
    <initialRenderContext.Provider value={initialRender}>
      <ViewportContextProvider
        headerRef={headerRef}
        mainRef={mainRef}
        footerRef={footerRef}
      >
        <div id="app" className={styles.root}>
          <Title />
          <Head>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header isBox={isBox} ref={setHeaderRef} />
          <main className={styles.main} ref={setMainRef}>
            <Component {...pageProps} />
          </main>
          {!isBox && <Footer ref={setFooterRef} />}
        </div>
      </ViewportContextProvider>
    </initialRenderContext.Provider>
  );
}
