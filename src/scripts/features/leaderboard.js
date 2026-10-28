import { $ } from '../services/dom.js';
import { formatDuration } from '../utils/format.js';

const STORAGE_KEY = 'arquivo013.leaderboard.v1';
const MAX_RECORDS = 50;

function readRecords() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((record) => record && typeof record.name === 'string' && Number.isFinite(record.seconds)) : [];
  } catch {
    return [];
  }
}

export function createLeaderboard() {
  function render() {
    const host = $('#leaderboardRows');
    if (!host) return;
    const records = readRecords().sort((a, b) => a.seconds - b.seconds || a.completedAt - b.completedAt).slice(0, 5);
    host.replaceChildren();
    if (!records.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-rank';
      empty.textContent = 'Nenhum investigador classificado. Seja o primeiro.';
      host.append(empty);
      return records;
    }
    const table = document.createElement('div');
    table.className = 'rank-table';
    const head = document.createElement('div');
    head.className = 'rank-row rank-head';
    ['POS.', 'INVESTIGADOR', 'TEMPO', 'DATA'].forEach((label) => {
      const cell = document.createElement('span'); cell.textContent = label; head.append(cell);
    });
    table.append(head);
    records.forEach((record, index) => {
      const row = document.createElement('div'); row.className = `rank-row${index === 0 ? ' first-place' : ''}`;
      const values = [String(index + 1).padStart(2, '0'), record.name, formatDuration(record.seconds), new Date(record.completedAt).toLocaleDateString('pt-BR')];
      values.forEach((value) => { const cell = document.createElement('span'); cell.textContent = value; cell.title = value; row.append(cell); });
      table.append(row);
    });
    host.append(table);
    return records;
  }

  function save(state, seconds) {
    if (state.recordSaved || !state.playerName || !state.finished) return;
    const record = { name: state.playerName.slice(0, 24), seconds, completedAt: Date.now() };
    try {
      const records = [...readRecords(), record].slice(-MAX_RECORDS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      state.recordSaved = true;
    } catch {
      // O jogo continua funcionando mesmo se o navegador bloquear armazenamento local.
    }
    render();
  }

  return { render, save };
}
