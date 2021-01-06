import { ReactNode } from 'react';
import Header from './Header';

type Props = {
  children?: ReactNode;
  isBox?: boolean;
};

export default function Home({ children, isBox }: Props): JSX.Element {
  return (
    <div className="layout">
      <Header isBox={isBox} />
      <main className="layout-main">{children}</main>
      {!isBox && (
        <footer className="layout-footer">
          &copy; 2021 <a href="https://github.com/SimplyLinn">Linn Dahlgren</a>.
          All rights reserved. Designed by{' '}
          <a href="https://github.com/aewens">Austin Ewens</a>.
        </footer>
      )}
    </div>
  );
}
