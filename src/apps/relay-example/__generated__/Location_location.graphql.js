/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { CountryFlag_location$ref } from "./CountryFlag_location.graphql";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Location_location$ref: FragmentReference;
export type Location_location = {|
  +name: ?string,
  +$fragmentRefs: CountryFlag_location$ref,
  +$refType: Location_location$ref,
|};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "Location_location",
  "type": "Location",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CountryFlag_location",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '90b49a75389a827efd865272010594b8';
module.exports = node;
