import React, { PropsWithChildren } from 'react';
import Title from 'stimbox/Components/Title';
import styles from './page.module.css';

export { styles as pageStyles };

interface Props {
  title?: string;
}
export default function Page({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <div className={styles.root}>
      {title != null && (
        <>
          <Title>{title}</Title>
          <h1>{title}</h1>
        </>
      )}
      {children}
    </div>
  );
}
