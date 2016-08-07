/* @flow */

import test from 'tape';
import formatQuickfix from '../src/formatQuickfix';
import F1 from './fixture/1.json';
import F2 from './fixture/2.json';

test('formatQuickfix', (t) => {
  t.test('with fixture/1.json', (q) => {
    const lines = formatQuickfix(F1)

    q.equals(lines.length, 7, 'there should be the appropriate number of lines');

    q.equals(lines[0], 'redux-saga_0.9.5.js:25:5,28: [LIB] | $npm$ReduxSaga$PutEffect | Application of polymorphic type needs <list of 1 argument>. (Can use `*` for inferrable ones)', 'line 1 should have the right format');
    q.equals(lines[1], 'redux-saga_0.9.5.js:26:5,29: [LIB] | $npm$ReduxSaga$CallEffect | Application of polymorphic type needs <list of 1 argument>. (Can use `*` for inferrable ones)', 'line 2 should have the right format');
    // q.equals(lines[2], 'test_redux-saga_0.9.5.js:5:55,61: redux | Required module not found', 'line 3 should have the right format');
    // q.equals(lines[3], 'test_redux-saga_0.9.5.js:6:34,45: redux-saga | Required module not found', 'line 4 should have the right format');
    // q.equals(lines[4], 'test_redux-saga_0.9.5.js:7:39,58: redux-saga/effects | Required module not found', 'line 5 should have the right format');
    // q.equals(lines[5], 'test_redux-saga_0.9.5.js:13:15,35: identifier `$npm$ReduxSaga$Effect` | Could not resolve name', 'line 6 should have the right format');
    // q.equals(lines[6], 'test_redux-saga_0.9.5.js:26:15,18: property `type` | Property not found in `Array` | const { type } = action;', 'line 7 should have the right format');

    q.end();
  });

  t.test('with fixture/2.json', (q) => {
    const lines = formatQuickfix(F2)

    q.equals(lines.length, 3, 'there should be the appropriate number of lines');

    // q.equals(lines[0], '/Projects/test/interface/redux-saga_0.9.5.js:25:5,28: [LIB] | $npm$ReduxSaga$PutEffect | Application of polymorphic type needs <list of 1 argument>. (Can use `*` for inferrable ones)', 'line 1 should have the right format');
    // q.equals(lines[1], '/Projects/test/interface/redux-saga_0.9.5.js:26:5,29: [LIB] | $npm$ReduxSaga$CallEffect | Application of polymorphic type needs <list of 1 argument>. (Can use `*` for inferrable ones)', 'line 2 should have the right format');
    // q.equals(lines[2], '/Projects/test/test_redux-saga_0.9.5.js:26:15,18: property `type` | Property not found in `Array` | const { type } = action;', 'line 3 should have the right format');

    q.end();
  });

  t.end();
});
