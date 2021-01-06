import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
          />
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
