import Head from 'next/head';

export default function Title({
  children,
}: {
  children?: string;
}): JSX.Element {
  return (
    <Head>
      <title>{children ? `${children} | ` : ''}Stimbox</title>
    </Head>
  );
}
