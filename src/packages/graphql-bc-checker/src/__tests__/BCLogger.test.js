// @flow

import fs from 'fs';
import path from 'path';
import stripAnsi from 'strip-ansi';
import { generateTestsFromFixtures } from '@kiwicom/test-utils';

import { buildBreakingChangesBlock } from '../BCLogger';
import testBackwardCompatibility from '../index';

function operation(newBreakingChanges) {
  return input => buildBreakingChangesBlock(input, newBreakingChanges);
}

generateTestsFromFixtures(`${__dirname}/__fixtures__`, operation());
generateTestsFromFixtures(
  `${__dirname}/__fixtures__`,
  operation([
    {
      type: 'append',
      description: 'this',
    },
    {
      type: 'and append',
      description: 'also this',
    },
  ]),
);

function stringifyMockCalls<T: $ReadOnlyArray<string>>(calls: T): T {
  return calls.map(call => {
    return stripAnsi(call.toString().trim());
  });
}

it('prints success message when there are no breaking changes', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  testBackwardCompatibility({
    allowBreakingChanges: false,
    snapshotLocation: path.join(__dirname, 'testSchemaSnapshot.graphql'),
    schema: require('./testSchema').validSchema,
  });

  expect(stringifyMockCalls(consoleSpy.mock.calls)).toMatchInlineSnapshot(`
    Array [
      "Testing: testSchemaSnapshot.graphql",
      "Congratulations! NO BREAKING CHANGES or OUTDATED SCHEMA. Good job!",
    ]
  `);

  jest.restoreAllMocks();
});

it('prints error messages when there are breaking changes', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const processSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
    throw new Error(`process.exit(${code}) was called`);
  });

  expect(() =>
    testBackwardCompatibility({
      allowBreakingChanges: false,
      snapshotLocation: path.join(__dirname, 'testSchemaSnapshot.graphql'),
      schema: require('./testSchema').breakingSchema,
    }),
  ).toThrow('process.exit(1) was called');

  expect(stringifyMockCalls(consoleErrorSpy.mock.calls)).toMatchInlineSnapshot(`
    Array [
      "You introduced breaking changes into the public GraphQL schema. This change may or may not be intentional. These breaking changes may break some clients consuming our public API. Please try to find a way how to avoid breaking changes and try it again. Here is list of all breaking changes:",
      "FIELD_REMOVED - RootQuery.test was removed.",
    ]
  `);
  expect(stringifyMockCalls(consoleLogSpy.mock.calls)).toMatchInlineSnapshot(`
    Array [
      "Testing: testSchemaSnapshot.graphql",
      "Tips how to avoid breaking changes:

    - field removal/modification (introduce new field and only deprecate the old one)
    - type removal/modification (just deprecate it and leave it there)
    - removal from enum/union (introduce new enum/union)
    - arguments removal/modification (introduce new query or graph node)
    - change non-nullable -> nullable (just don't do it or introduce new field)
    - change of default argument value (don't or introduce new argument/query)",
    ]
  `);
  expect(processSpy).toHaveBeenCalledWith(1);

  jest.restoreAllMocks();
});

it('prints error messages when the schema is manually polluted', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const processSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
    throw new Error(`process.exit(${code}) was called`);
  });

  expect(() =>
    testBackwardCompatibility({
      allowBreakingChanges: false,
      snapshotLocation: path.join(__dirname, 'testSchemaSnapshotPolluted.graphql'),
      schema: require('./testSchema').validSchema,
    }),
  ).toThrow('process.exit(1) was called');
  expect(stringifyMockCalls(consoleSpy.mock.calls)).toMatchInlineSnapshot(`
    Array [
      "Testing: testSchemaSnapshotPolluted.graphql",
      "Manual changes of GraphQL snapshot detected. Please do not update GraphQL snapshot manually. This file is being autogenerated.",
    ]
  `);
  expect(processSpy).toHaveBeenCalledWith(1);

  jest.restoreAllMocks();
});

it('prints warning and updates the schema when backward compatible changes detected', () => {
  const fsSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const processSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
    throw new Error(`process.exit(${code}) was called`);
  });

  expect(() =>
    testBackwardCompatibility({
      allowBreakingChanges: false,
      snapshotLocation: path.join(__dirname, 'testSchemaSnapshot.graphql'),
      schema: require('./testSchema').compatibleSchema,
    }),
  ).toThrow('process.exit(1) was called');

  expect(fsSpy.mock.calls[0][1]).toMatchSnapshot();
  expect(stringifyMockCalls(consoleSpy.mock.calls)).toMatchInlineSnapshot(`
    Array [
      "Testing: testSchemaSnapshot.graphql",
      "GraphQL schema snapshot IS OUTDATED! (updating automatically)",
      "Snapshot of the GraphQL schema successfully created! In case you see this message in CI you have to run locally command \`yarn test-bc\` and commit the changes.",
    ]
  `);
  expect(processSpy).toHaveBeenCalledWith(1);

  jest.restoreAllMocks();
});
