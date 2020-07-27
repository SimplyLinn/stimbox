import { ReactNode } from 'react';
import Header from './Header';

type Props = {
  children?: ReactNode;
};

export default function Home({ children }: Props) {
  return (
    <div className="layout">
      <header className="layout-header">
        <Header />
      </header>
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">Tha footer</footer>
    </div>
  );
}
