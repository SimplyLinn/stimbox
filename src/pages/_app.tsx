import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import 'simplebar/dist/simplebar.min.css';
import 'stimbox/style/index.css';
import styles from 'stimbox/Components/Layout/layout.module.css';
import Head from 'next/head';
import Header from 'stimbox/Components/Layout/Header';
import { initialRenderContext } from 'stimbox/hooks/useInitialRender';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    if (typeof window !== 'undefined') setInitialRender(false);
  }, []);
  const isBox =
    (Component as typeof Component & { isBox?: boolean }).isBox || false;
  return (
    <initialRenderContext.Provider value={initialRender}>
      <div id="app" className={styles.root}>
        <Head>
          <title>Stimbox</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header isBox={isBox} />
        <main className={styles.main}>
          <Component {...pageProps} />
        </main>
        {!isBox && (
          <footer className={styles.footer}>
            &copy; 2021{' '}
            <a href="https://github.com/SimplyLinn">Linn Dahlgren</a>. All
            rights reserved. Designed by{' '}
            <a href="https://github.com/aewens">aewens</a>.
          </footer>
        )}
      </div>
    </initialRenderContext.Provider>
  );
}
