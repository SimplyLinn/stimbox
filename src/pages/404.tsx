import Head from 'next/head';
import React from 'react';
import Page from 'stimbox/Components/Layout/Page';

function NotFound(): JSX.Element {
  return (
    <Page title="Not Found">
      <Head>
        <meta httpEquiv="Status" content="404 Not Found" />
        <meta name="robots" content="noindex" />
      </Head>
      <p>The page you&apos;re looking for could not be found.</p>
    </Page>
  );
}

export default NotFound;
