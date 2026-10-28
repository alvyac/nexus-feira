import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, createSessionId } from '../src/scripts/utils/format.js';

test('formatDuration formats seconds as MM:SS', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(9), '00:09');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(3600), '60:00');
});

test('formatDuration handles invalid and negative values safely', () => {
  assert.equal(formatDuration(-10), '00:00');
  assert.equal(formatDuration(Number.NaN), '00:00');
});

test('createSessionId returns a six-character uppercase identifier', () => {
  assert.equal(createSessionId(() => 0.5), '800000');
  assert.equal(createSessionId(() => 0), '000000');
});
