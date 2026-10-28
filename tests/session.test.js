import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, getElapsedSeconds, canAccessTerminal, resetState } from '../src/scripts/state/session.js';

test('session starts with a clean state', () => {
  const state = createInitialState(1000);
  assert.equal(state.readEvidence.size, 0);
  assert.equal(state.commandsExecuted, 0);
  assert.equal(state.unlocked, false);
  assert.equal(state.finished, false);
});

test('session waits for the investigator before starting the timer', () => {
  const state = createInitialState();
  assert.equal(state.startedAt, null);
  assert.equal(getElapsedSeconds(state, 9000), 0);
});

test('elapsed time is measured in whole seconds and never negative', () => {
  const state = createInitialState(1000);
  assert.equal(getElapsedSeconds(state, 6999), 5);
  assert.equal(getElapsedSeconds(state, 500), 0);
});

test('terminal is available only after all evidence is read', () => {
  const state = createInitialState();
  assert.equal(canAccessTerminal(state, 3), false);
  state.readEvidence.add('log');
  state.readEvidence.add('audio');
  state.readEvidence.add('image');
  assert.equal(canAccessTerminal(state, 3), true);
});

test('reset creates a new empty session', () => {
  const state = createInitialState(1000);
  state.readEvidence.add('log');
  state.commandsExecuted = 4;
  const next = resetState(5000);
  assert.equal(next.readEvidence.size, 0);
  assert.equal(next.commandsExecuted, 0);
  assert.equal(next.startedAt, 5000);
});
