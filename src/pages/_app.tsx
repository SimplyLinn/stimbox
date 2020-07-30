import { AppProps } from 'next/app';
import '../style/index.css';
import Head from 'next/head';
import { Theme } from 'boxd';

export default function MyApp({ Component, pageProps }: AppProps) {
  console.log(Theme.getThemeColor('text-color'));
  return (
    <div id="app">
      <Head>
        <title>Stimbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
