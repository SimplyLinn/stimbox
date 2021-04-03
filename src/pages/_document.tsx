import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.15.1/css/brands.css"
          />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.15.1/css/solid.css"
          />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.15.1/css/fontawesome.css"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
