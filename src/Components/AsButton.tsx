import { cloneElement, Children } from 'react';

type Props = {
  onTrigger: () => void;
  children: React.ReactElement<
    React.DetailedHTMLProps<React.HTMLAttributes<unknown>, unknown>
  >;
};

export default function AsButton({
  onTrigger,
  children,
}: Props): React.ReactElement<
  React.DetailedHTMLProps<React.HTMLAttributes<unknown>, unknown>
> {
  const props = {
    onMouseDown(ev: React.MouseEvent) {
      ev.preventDefault();
    },
    onClick() {
      onTrigger();
    },
    onKeyPress(ev: React.KeyboardEvent) {
      if (ev.key === 'Enter') onTrigger();
    },
    onKeyUp(ev: React.KeyboardEvent) {
      if (ev.key === ' ') onTrigger();
    },
    role: 'button',
    tabIndex: 0,
    style: { cursor: 'pointer' },
  };
  const child = Children.only(children);
  const childProps = 'props' in child ? child.props : {};
  if ('role' in childProps) {
    delete props.role;
  }
  if ('tabIndex' in childProps) {
    delete props.tabIndex;
  }
  if ('style' in childProps) {
    props.style = { ...props.style, ...childProps.style };
  }
  return cloneElement(child, props);
}
