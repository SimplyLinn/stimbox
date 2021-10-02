import React, { forwardRef } from 'react';
import Link from 'next/link';
import buildStatus from 'stimbox/utils/bulidStatus';
import styles from './Footer.module.css';

export function GitHashLink({ hash }: { hash: string }): JSX.Element {
  return (
    <tr>
      <th>Commit</th>
      <td>
        <a href={`https://github.com/SimplyLinn/stimbox/tree/${hash}`}>
          {hash.substr(0, 7)}
        </a>
      </td>
    </tr>
  );
}

export function BuildInfo(): JSX.Element {
  const noGitString =
    process.env.NODE_ENV !== 'development'
      ? 'UNKNOWN BUILD'
      : 'Development Build';
  return (
    <table className={styles.buildTable}>
      <tbody>
        {buildStatus.isGit ? (
          <GitHashLink hash={buildStatus.hash} />
        ) : (
          <tr>
            <td colSpan={2}>{noGitString}</td>
          </tr>
        )}
        {buildStatus?.isDirty && (
          <tr>
            <th>Note</th>
            <td>
              <Link href="/modified-worktree">
                <a>Modified worktree</a>
              </Link>
            </td>
          </tr>
        )}

        {buildStatus.buildTime != null && (
          <tr>
            <th>Built at</th>
            <td>{buildStatus.buildTime}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

const Footer = forwardRef<HTMLElement>((props, ref) => {
  return (
    <footer ref={ref} className={styles.root}>
      <div>
        &copy; 2021 <a href="https://github.com/SimplyLinn">Linn Dahlgren</a>
        <br />
        Designed by <a href="https://github.com/aewens">aewens</a>
        <br />
        <i className="fab fa-github" />{' '}
        <a href="https://github.com/SimplyLinn/stimbox">
          This project on GitHub
        </a>
      </div>
      <BuildInfo />
    </footer>
  );
});

export default Footer;
