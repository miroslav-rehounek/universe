// @flow

import fs from 'fs';
import path from 'path';
import stripAnsi from 'strip-ansi';

import codeframe, { type Results } from '../codeframe';

function getMockMessage(severity: 'warning' | 'error') {
  return {
    ruleId: 'rule-id-111',
    severity: severity === 'warning' ? 1 : 2,
    message: 'too ridiculous',
    line: 4,
    column: 0,
    nodeType: 'mock',
    messageId: 'mock',
    endLine: 4,
    endColumn: 27,
  };
}

function getMockUnusedDirectiveMessage() {
  return {
    ruleId: null,
    message: 'Unused eslint-disable directive (MOCK).',
    line: 3,
    column: 1,
    severity: 2,
    nodeType: null,
  };
}

function getMockResults(messages): Results {
  return [
    {
      filePath: 'src/sleepSort.js',
      messages,
      errorCount: 1,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      source: fs.readFileSync(path.join(__dirname, 'sleepSort.js'), 'utf8'),
    },
  ];
}

it('prints the error as expected', () => {
  const results = getMockResults([getMockMessage('warning'), getMockMessage('error')]);
  expect(stripAnsi(codeframe(results, { highlightCode: false }))).toMatchSnapshot();
});

it('prints the warnings first', () => {
  const results = getMockResults([
    getMockUnusedDirectiveMessage(),
    getMockMessage('error'),
    getMockMessage('warning'),
    getMockMessage('error'),
    getMockMessage('warning'),
    getMockMessage('warning'),
    getMockMessage('warning'),
  ]);

  expect(stripAnsi(codeframe(results, { highlightCode: false }))).toMatchSnapshot();
});

it('prints unused eslint-disable directive correctly', () => {
  const results = getMockResults([getMockUnusedDirectiveMessage()]);
  expect(stripAnsi(codeframe(results, { highlightCode: false }))).toMatchSnapshot();
});
