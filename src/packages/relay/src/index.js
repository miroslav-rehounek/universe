// @flow

import {
  commitLocalUpdate,
  requestSubscription,
  graphql as _graphql,
} from 'react-relay';

import commitMutation from './commitMutation';
import createFragmentContainer from './createFragmentContainer';
import createPaginationContainer, {
  type PaginationRelayProp as _PaginationRelayProp,
} from './createPaginationContainer';
import createRefetchContainer, {
  type RefetchRelayProp as _RefetchRelayProp,
} from './createRefetchContainer';
import QueryRenderer from './QueryRenderer';
import type { GraphQLTaggedNode } from './types.flow';

module.exports = {
  // TODO: expose both FetchTimeoutError and FetchResponseError (@kiwicom/fetch)
  createEnvironment: require('./createEnvironment'),
  createNetworkFetcher: require('./fetchers/createNetworkFetcher'),

  // Relay-only things:
  commitLocalUpdate,
  commitMutation,
  createFragmentContainer,
  createPaginationContainer,
  createRefetchContainer,
  graphql,
  QueryRenderer,
  requestSubscription,
};

function graphql(strings: Array<string>): GraphQLTaggedNode {
  return _graphql(strings);
}

export type PaginationRelayProp = _PaginationRelayProp;
export type RefetchRelayProp = _RefetchRelayProp;
