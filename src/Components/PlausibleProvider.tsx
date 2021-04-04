import Plausible from 'next-plausible';
import { ReactNode } from 'react';

const plausibleProps = {
  domain: 'stimbox.space',
  customDomain: 'https://stats.linn.lgbt',
  selfHosted: true,
};

export default function PlausibleProvider({
  children,
}: {
  children?: ReactNode;
}): JSX.Element {
  return <Plausible {...plausibleProps}>{children}</Plausible>;
}
