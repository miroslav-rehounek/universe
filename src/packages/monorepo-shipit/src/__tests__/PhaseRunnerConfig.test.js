// @flow strict-local

import Config from '../PhaseRunnerConfig';

jest.mock('fs');

it('returns set of paths when trying to access monorepo roots', () => {
  expect(
    new Config(
      'fake monorepo path',
      'fake exported repo URL',
      new Map([['/known_path', '/destination_path']]),
    ).getMonorepoRoots(),
  ).toEqual(new Set(['/known_path']));
});

it('returns empty set when trying to get roots of the exported repo', () => {
  expect(
    new Config(
      'fake monorepo path',
      'fake exported repo URL',
      new Map([['/known_path', '/destination_path']]),
    ).getExportedRepoRoots(),
  ).toEqual(
    new Set(), // empty set expected
  );
});
