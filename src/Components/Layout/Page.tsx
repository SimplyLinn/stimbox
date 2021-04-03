import { PropsWithChildren } from 'react';
import styles from './page.module.css';

interface Props {
  title: string;
}
export default function Page({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
}
