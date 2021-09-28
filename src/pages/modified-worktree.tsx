import React from 'react';
import Page from 'stimbox/Components/Layout/Page';

export default function ModifiedWorktree(): JSX.Element {
  return (
    <Page title="Modified Worktree">
      <p>
        If you see a note &quot;Modified worktree&quot; in the build
        information, this means that when the project was built, there were
        changes in the project that are not part of commit. This means that if
        there are issues or features present in this website it may not be
        reflected in the specified commit.
      </p>
    </Page>
  );
}
