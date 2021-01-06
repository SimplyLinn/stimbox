import { AppProps } from 'next/app';
import 'simplebar/dist/simplebar.min.css';
import '../style/index.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
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
