import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import 'simplebar/dist/simplebar.min.css';
import 'stimbox/style/index.css';
import styles from 'stimbox/Components/Layout/layout.module.css';
import Head from 'next/head';
import Header from 'stimbox/Components/Layout/Header';
import { initialRenderContext } from 'stimbox/hooks/useInitialRender';
import Footer from 'stimbox/Components/Layout/Footer';

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
        {!isBox && <Footer />}
      </div>
    </initialRenderContext.Provider>
  );
}
