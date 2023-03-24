/**
 * This file is automatically GENERATED.
 * Manual changes might be lost - proceed with caution!
 *
 * @flow strict
 */

import React, { type Element } from 'react';

type Props = {
  +'data-testid'?: string,
};

export default function WarningTriangle(props: Props): Element<'svg'> {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21" {...props}>
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9.5.5 9 16H.5zm0 10v-5"
        />
        <circle cx={9.5} cy={13.5} r={1} fill="currentColor" />
      </g>
    </svg>
  );
}
