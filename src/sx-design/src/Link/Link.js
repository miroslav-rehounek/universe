// @flow

import * as React from 'react';
import {
  Link as LinkHeadless,
  type LinkProps as LinkHeadlessProps,
} from '@adeira/sx-design-headless';
import sx, { type AllCSSProperties } from '@adeira/sx';

import { MediaQueryMotion } from '../MediaQueries';

type Props = $ReadOnly<{
  ...LinkHeadlessProps,
  +isActive?: boolean,
  +xstyle?: AllCSSProperties,
}>;

/**
 * This component creates a normal `<a />` link with some reasonable default styles for
 * light and dark mode. It also sets `noreferrer` and `noopener` correctly for external links.
 *
 * Optionally, you can use [React refs](https://reactjs.org/docs/refs-and-the-dom.html) and it will
 * be forwarded to the HTML `<a />` element as expected.
 *
 * ## CSS variables
 *
 * `--sx-link-text-color` (overwrites default link color)
 */
export default (React.forwardRef(function Link(props, ref) {
  return (
    <LinkHeadless
      ref={ref}
      href={props.href}
      data-testid={props['data-testid']}
      target={props.target}
      className={sx(styles.default, props.isActive ? styles.active : styles.inactive, props.xstyle)}
      onClick={props.onClick}
    >
      {props.children}
    </LinkHeadless>
  );
}): React.AbstractComponent<Props, HTMLAnchorElement>);

const styles = sx.create({
  default: {
    'color': 'rgba(var(--sx-link-text-color))',
    'cursor': 'pointer',
    'textDecorationColor': 'transparent',
    'textDecorationLine': 'underline',
    'textDecorationStyle': 'solid',
    'textDecorationThickness': '.05em',
    [MediaQueryMotion.NO_PREFERENCE]: {
      transition: 'text-decoration-color 300ms',
    },
    ':hover': {
      opacity: 1,
      textDecorationColor: 'inherit',
    },
  },
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.9,
  },
});
