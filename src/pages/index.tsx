import Head from 'next/head';
import Link from 'next/link';
import Layout from 'Components/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Home | Stimbox</title>
      </Head>
      <Link href="/boxes">
        <a>hello</a>
      </Link>
      INDEX PAGE!
    </Layout>
  );
}
