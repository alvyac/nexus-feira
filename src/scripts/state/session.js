/** Estado único da sessão atual; a interface nunca deve ser a fonte do estado. */
export function createInitialState(now = null) {
  return {
    readEvidence: new Set(),
    commandsExecuted: 0,
    startedAt: now,
    finishedAt: null,
    playerName: '',
    recordSaved: false,
    unlocked: false,
    finished: false,
    soundEnabled: false,
    reportVisible: false,
  };
}

export function getElapsedSeconds(state, now = Date.now()) {
  if (!state.startedAt) return 0;
  const end = state.finishedAt ?? now;
  return Math.floor(Math.max(0, end - state.startedAt) / 1000);
}

export function canAccessTerminal(state, totalEvidence) {
  return state.readEvidence.size === totalEvidence;
}

export function resetState(now = null) {
  return createInitialState(now);
}
