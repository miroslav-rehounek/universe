// @flow strict-local

import addTrackingData from '../addTrackingData';
import Changeset from '../../Changeset';

it('adds tracking data', () => {
  const changeset = new Changeset()
    .withID('MOCK_COMMIT_ID')
    .withAuthor('John Doe')
    .withSubject('Commit subject')
    .withDescription('Commit description');

  expect(changeset).toMatchInlineSnapshot(`
    Changeset {
      "author": "John Doe",
      "debugMessages": Array [],
      "description": "Commit description",
      "diffs": undefined,
      "id": "MOCK_COMMIT_ID",
      "subject": "Commit subject",
      "timestamp": undefined,
    }
  `);

  expect(addTrackingData(changeset)).toMatchInlineSnapshot(`
    Changeset {
      "author": "John Doe",
      "debugMessages": Array [
        "ADD TRACKING DATA: \\"adeira-source-id: MOCK_COMMIT_ID\\"",
      ],
      "description": "Commit description

    adeira-source-id: MOCK_COMMIT_ID",
      "diffs": undefined,
      "id": "MOCK_COMMIT_ID",
      "subject": "Commit subject",
      "timestamp": undefined,
    }
  `);
});
