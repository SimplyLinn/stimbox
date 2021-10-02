import React from 'react';

export default function getDisplayName(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WrappedComponent: React.ComponentType<any>,
): string {
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    '[UnnamedComponent]'
  );
}
