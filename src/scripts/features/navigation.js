import { $ } from '../services/dom.js';

const PANELS = Object.freeze(['investigation', 'terminal', 'debrief']);
const PANEL_COPY = Object.freeze({
  investigation: ['CASO 013 / EVIDÊNCIAS RECUPERADAS', '● AGUARDANDO OPERADOR'],
  terminal: ['SHELL / ACESSO RESTRITO', '● TERMINAL ATIVO'],
  debrief: ['RELATÓRIO / SESSÃO ENCERRADA', '● CONCLUÍDO'],
});

export function createNavigation({ state, evidenceCount }) {
  let activePanel = 'investigation';

  function setPanel(name) {
    if (!PANELS.includes(name)) return;
    activePanel = name;
    for (const id of PANELS) {
      $(`#${id}`).classList.toggle('hidden', id !== name);
    }
    $('#nav-investigation').classList.toggle('active', name === 'investigation');
    $('#nav-terminal').classList.toggle('active', name === 'terminal');
    $('#nav-debrief').classList.toggle('active', name === 'debrief');
    $('#nav1').textContent = state.readEvidence.size === evidenceCount ? '✓' : name === 'investigation' ? '●' : '○';
    $('#nav2').textContent = state.unlocked ? '✓' : name === 'terminal' ? '●' : '○';
    $('#nav3').textContent = state.finished ? '✓' : name === 'debrief' ? '●' : '○';
    $('#paneltitle').textContent = PANEL_COPY[name][0];
    $('#panelstate').textContent = PANEL_COPY[name][1];
    if (name === 'terminal') window.setTimeout(() => $('#commandInput').focus(), 100);
  }

  return { setPanel, getActivePanel: () => activePanel };
}
