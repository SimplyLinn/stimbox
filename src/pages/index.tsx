import Head from 'next/head';
import Link from 'next/link';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | Stimbox</title>
      </Head>
      <Link href="/boxes">
        <a>hello</a>
      </Link>
    </>
  );
}
