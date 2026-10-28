import { EVIDENCE_IDS } from './data/evidence.js';
import { createAudioService } from './services/audio.js';
import { $, setVisible } from './services/dom.js';
import { createInitialState, resetState, canAccessTerminal, getElapsedSeconds } from './state/session.js';
import { formatDuration } from './utils/format.js';
import { createNavigation } from './features/navigation.js';
import { createEvidenceFeature } from './features/evidence.js';
import { createTerminal } from './features/terminal.js';
import { createReportFeature } from './features/report.js';
import { createLeaderboard } from './features/leaderboard.js';

const state = createInitialState();
const audio = createAudioService();
let finaleTimer = null;
let toastTimer = null;

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => element.classList.remove('show'), 2500);
}

function beep(frequency = 440, duration = 0.08, waveform = 'sine') {
  audio.beep(state.soundEnabled, frequency, duration, waveform);
}

const navigation = createNavigation({ state, evidenceCount: EVIDENCE_IDS.length });
const terminal = createTerminal({ state, beep, onUnlock: scheduleFinale });
const report = createReportFeature({ state, toast });
const leaderboard = createLeaderboard();
const evidence = createEvidenceFeature({
  state,
  beep,
  toast,
  onProgress: () => navigation.setPanel(navigation.getActivePanel()),
});

function scheduleFinale() {
  window.clearTimeout(finaleTimer);
  finaleTimer = window.setTimeout(showFinale, 950);
}

function showFinale() {
  if (!state.unlocked || state.finished) return;
  state.finished = true;
  state.finishedAt = Date.now();
  navigation.setPanel('debrief');
  $('#finalTitle').innerHTML = 'VOCÊ NÃO<br>ESTAVA <em>SOZINHO.</em>';
  $('#finalText').textContent = `${state.playerName || 'Investigador'}, o Dr. Miguel Vasconcelos tentou reconstruir a voz de sua filha Lia, morta dezoito anos antes. Às 03:13, o MEMORY_MIRROR respondeu — não como uma gravação, mas como algo que sabia estar preso dentro da máquina. O log registra duas presenças e nenhuma saída. O relatório oficial diz que a sala estava vazia. Ambos os documentos foram assinados pelo mesmo operador. Agora, enquanto você lê estas linhas, observer.exe acaba de registrar uma nova presença. Operador atribuído: ${state.playerName || 'VOCÊ'}. Se ouvir três batidas, não responda.`;
  $('#operator').textContent = state.playerName || 'VOCÊ';
  leaderboard.save(state, getElapsedSeconds(state));
  leaderboard.render();
  report.updateMetrics();
  document.body.classList.add('finale-distortion');
  $('#hero').classList.add('glitch');
  window.setTimeout(() => $('#hero').classList.remove('glitch'), 1200);
  window.setTimeout(() => document.body.classList.remove('finale-distortion'), 2600);
  // O final usa apenas interferência e ruído de rádio, sem transmissões faladas.
  beep(180, 0.65, 'sawtooth');
  window.setTimeout(() => beep(90, 0.9, 'sawtooth'), 380);
  window.setTimeout(() => audio.radioBurst(state.soundEnabled, 0.28), 1050);
  toast('ARQUIVO 013 // NOVA PRESENÇA DETECTADA.');
}

function resetExperience({ announce = true } = {}) {
  window.clearTimeout(finaleTimer);
  const soundPreference = state.soundEnabled;
  Object.assign(state, resetState());
  state.soundEnabled = soundPreference;
  $('#soundBtn').textContent = `SOM: ${state.soundEnabled ? 'LIGADO' : 'DESLIGADO'}`;
  $('#operator').textContent = 'DESCONHECIDO';
  $('#sidePlayerName').textContent = 'NÃO IDENTIFICADO';
  $('#sessionClock').textContent = '00:00';
  $('#playerName').value = '';
  $('#startOverlay').classList.remove('hidden');
  $('#startOverlay').setAttribute('aria-hidden', 'false');
  $('#reportArea').classList.add('hidden');
  $('#codeInput').value = '';
  $('#codeFeedback').textContent = '';
  $('#codeFeedback').classList.remove('good');
  $('#codeInput').classList.remove('glitch');
  $('#finalTitle').innerHTML = 'VOCÊ NÃO<br>ESTAVA <em>SOZINHO.</em>';
  $('#finalText').textContent = 'O arquivo foi aberto. Mas o que está lá dentro muda tudo.';
  $('#showReport').textContent = 'VER RELATÓRIO DO CASO';
  terminal.resetOutput();
  evidence.updateProgress();
  navigation.setPanel('investigation');
  leaderboard.render();
  if (announce) toast('Sessão reiniciada.');
}

$('#toTerminal').addEventListener('click', () => {
  if (!canAccessTerminal(state, EVIDENCE_IDS.length)) return;
  navigation.setPanel('terminal');
  beep(500);
});
$('#backEvidence').addEventListener('click', () => navigation.setPanel('investigation'));
$('#hintBtn').addEventListener('click', () => {
  toast(state.readEvidence.size < EVIDENCE_IDS.length
    ? 'Analise todos os arquivos. O mesmo horário aparece mais de uma vez.'
    : 'O horário está registrado no log, na gravação e no quadro da câmera.');
});
$('#restartBtn').addEventListener('click', () => resetExperience());
$('#restartBtn2').addEventListener('click', () => resetExperience());
$('#resetBtn').addEventListener('click', () => {
  if (window.confirm('Reiniciar toda a experiência? O progresso desta sessão será perdido.')) resetExperience();
});
$('#soundBtn').addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  $('#soundBtn').textContent = `SOM: ${state.soundEnabled ? 'LIGADO' : 'DESLIGADO'}`;
  audio.setAmbient(state.soundEnabled);
  if (state.soundEnabled) {
    beep(520);
    toast('Ambiente sonoro e efeitos ativados. Ajuste o volume do computador.');
  } else {
    toast('Áudio desligado.');
  }
});
$('#fullscreenBtn').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    toast('Tela cheia não disponível neste navegador.');
  }
});

function updateClock() {
  $('#clock').textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
}
updateClock();
window.setInterval(updateClock, 1000);
function updateSessionClock() {
  const elapsed = formatDuration(getElapsedSeconds(state));
  $('#sessionClock').textContent = elapsed;
  $('#sessionClock').classList.toggle('timer-urgent', getElapsedSeconds(state) >= 600 && !state.finished);
}
updateSessionClock();
window.setInterval(updateSessionClock, 1000);

$('#startForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('#playerName').value.trim().replace(/\s+/g, ' ');
  if (!name) { $('#playerName').focus(); return; }
  state.playerName = name.slice(0, 24);
  state.startedAt = Date.now();
  $('#operator').textContent = state.playerName.toUpperCase();
  $('#sidePlayerName').textContent = state.playerName.toUpperCase();
  $('#startOverlay').classList.add('hidden');
  $('#startOverlay').setAttribute('aria-hidden', 'true');
  $('#playerName').blur();
  updateSessionClock();
  toast(`Investigação iniciada. Boa sorte, ${state.playerName}.`);
  beep(520, 0.12, 'triangle');
  window.setTimeout(() => {
    if (!state.finished && state.startedAt && state.soundEnabled) audio.radioBurst(true, 0.3);
  }, 2200);
});

// Horror psicológico sem mensagens faladas: apenas falhas visuais e chiados de rádio.
window.setInterval(() => {
  if (state.finished || !state.startedAt) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && Math.random() > 0.48) {
    document.body.classList.add('signal-break');
    window.setTimeout(() => document.body.classList.remove('signal-break'), 180 + Math.random() * 240);
  }
  if (state.soundEnabled && Math.random() > 0.58) {
    audio.radioBurst(true, 0.18 + Math.random() * 0.32);
    if (Math.random() > 0.72) beep(58 + Math.random() * 35, 0.055, 'sawtooth');
  }
}, 9000);
navigation.setPanel('investigation');
evidence.updateProgress();
leaderboard.render();
setVisible($('#modal'), false);

// Atualiza o relatório se a pessoa o deixar aberto durante a sessão.
window.setInterval(() => {
  if (state.reportVisible && !state.finished) report.updateMetrics();
}, 1000);
