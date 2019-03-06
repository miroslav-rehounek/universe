// @flow

import { commitLocalUpdate as _commitLocalUpdate } from 'react-relay';

import type { Environment, RecordSourceSelectorProxy } from './types.flow';

opaque type SelectorData = $FlowFixMe;

/**
 * The first parameter `environment` should be from `props.relay.environment`
 * to ensure the update is performed in the correct environment.
 */
export default function commitLocalUpdate(
  environment: Environment,
  updater: (store: RecordSourceSelectorProxy, data: SelectorData) => void,
) {
  return _commitLocalUpdate(environment, updater);
}
