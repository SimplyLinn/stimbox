import { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children?: ReactNode;
};

export default function Home({ children }: Props) {
  return (
    <div className="layout">
      <header className="layout-header">
        <Link href="/">
          <a>
            <h1>stimbox</h1>
          </a>
        </Link>
      </header>
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">Tha footer</footer>
    </div>
  );
}
