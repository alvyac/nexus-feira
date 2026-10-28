import { $ } from '../services/dom.js';
import { formatDuration } from '../utils/format.js';
import { getElapsedSeconds } from '../state/session.js';

export function createReportFeature({ state, toast }) {
  function updateMetrics() {
    $('#metricTime').textContent = formatDuration(getElapsedSeconds(state));
    $('#metricClues').textContent = `${state.readEvidence.size}/3`;
    $('#metricCommands').textContent = String(state.commandsExecuted);
  }

  function showReport() {
    state.reportVisible = true;
    $('#reportArea').classList.remove('hidden');
    updateMetrics();
    $('#showReport').textContent = 'RELATÓRIO ABERTO ✓';
  }

  $('#showReport').addEventListener('click', showReport);
  $('#printBtn').addEventListener('click', () => window.print());
  return { showReport, updateMetrics };
}
