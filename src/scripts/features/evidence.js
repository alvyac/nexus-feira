import { EVIDENCE, EVIDENCE_IDS } from '../data/evidence.js';
import { $, $$, setVisible } from '../services/dom.js';

export function createEvidenceFeature({ state, beep, toast, onProgress }) {
  const modal = $('#modal');
  const modalContent = $('#modalContent');
  let previouslyFocused = null;

  function closeModal() {
    const player = modalContent.querySelector('audio');
    if (player) { player.pause(); player.currentTime = 0; }
    setVisible(modal, false);
    previouslyFocused?.focus();
  }

  function updateProgress() {
    const count = state.readEvidence.size;
    $('#progressText').textContent = `${count} / ${EVIDENCE_IDS.length}`;
    $('#progressBar').style.width = `${(count / EVIDENCE_IDS.length) * 100}%`;
    $('#progressBar').parentElement.setAttribute('aria-valuenow', String(count));
    $('#toTerminal').disabled = count !== EVIDENCE_IDS.length;
    const connectionStatus = $('#connectionStatus');
    if (connectionStatus) {
      connectionStatus.textContent = count === EVIDENCE_IDS.length
        ? 'CONTRADIÇÃO CONFIRMADA // TERMINAL LIBERADO'
        : `${count}/${EVIDENCE_IDS.length} ARQUIVOS ANALISADOS // A CONTRADIÇÃO AINDA NÃO FOI CONFIRMADA`;
      connectionStatus.classList.toggle('complete', count === EVIDENCE_IDS.length);
    }

    for (const id of EVIDENCE_IDS) {
      $(`#seen-${id}`).textContent = state.readEvidence.has(id) ? 'LIDO ✓' : 'NÃO LIDO ↗';
      $(`[data-file="${id}"]`).classList.toggle('opened', state.readEvidence.has(id));
    }
    onProgress();
  }

  function openEvidence(id, trigger) {
    const evidence = EVIDENCE[id];
    if (!evidence) return;
    previouslyFocused = trigger;
    state.readEvidence.add(id);
    updateProgress();

    $('#modalCode').textContent = evidence.code;
    modalContent.replaceChildren();

    const kicker = document.createElement('div');
    kicker.className = 'kicker';
    kicker.textContent = evidence.code;
    const title = document.createElement('h3');
    title.textContent = evidence.title;
    if (id === 'image') {
      const surveillanceFrame = document.createElement('figure');
      surveillanceFrame.className = 'surveillance-frame';
      const image = document.createElement('img');
      image.src = '/cam-013-duas-silhuetas.png';
      image.alt = 'Imagem granulada de câmera de segurança mostrando duas silhuetas indistintas em uma sala escura.';
      image.loading = 'eager';
      const caption = document.createElement('figcaption');
      caption.textContent = 'CAM_013 // FRAME RECUPERADO — 03:13:00 — QUALIDADE: 4%';
      surveillanceFrame.append(image, caption);
      modalContent.append(surveillanceFrame);
    }

    const documentBody = document.createElement('div');
    documentBody.className = 'doc';
    documentBody.textContent = evidence.body;

    // A transcrição continua disponível para todos; a gravação é uma opção extra.
    let audioPlayer = null;
    if (id === 'audio') {
      const audioPanel = document.createElement('section');
      audioPanel.className = 'evidence-audio';
      const audioHeading = document.createElement('h4');
      audioHeading.textContent = '▶ OUVIR FRAGMENTO ORIGINAL';
      const audioDescription = document.createElement('p');
      audioDescription.textContent = 'Gravação reconstruída com voz sintética e estática contínua. Entre 00:31 e 00:44, não há fala: só o chiado do rádio. Quando a voz retorna, ela emerge lentamente do ruído. Use os controles para ouvir ou pausar.';
      audioPlayer = document.createElement('audio');
      audioPlayer.className = 'evidence-audio-player';
      audioPlayer.controls = true;
      audioPlayer.preload = 'none';
      audioPlayer.src = '/voice-fragment.wav';
      audioPlayer.setAttribute('aria-label', 'Ouvir fragmento de áudio recuperado');
      const radioCaption = document.createElement('p');
      radioCaption.className = 'audio-caption';
      radioCaption.textContent = 'VOICE_FRAGMENT.WAV // ESTÁTICA CONTÍNUA // 13 S SEM VOZ';
      audioPanel.append(audioHeading, audioDescription, audioPlayer, radioCaption);
    }
    const note = document.createElement('p');
    note.textContent = evidence.note;
    const buttonRow = document.createElement('div');
    buttonRow.className = 'btnrow';
    const done = document.createElement('button');
    done.className = 'btn primary';
    done.type = 'button';
    done.textContent = 'MARCAR COMO ANALISADO ✓';
    done.addEventListener('click', () => {
      closeModal();
      beep(660);
      if (state.readEvidence.size === EVIDENCE_IDS.length) {
        toast('Todas as evidências foram analisadas. Terminal liberado.');
      }
    });
    buttonRow.append(done);
    if (audioPlayer) {
      modalContent.append(kicker, title, documentBody, audioPlayer.parentElement, note, buttonRow);
    } else {
      modalContent.append(kicker, title, documentBody, note, buttonRow);
    }
    setVisible(modal, true);
    done.focus();
    beep(520, 0.06);
  }

  $$('.filecard').forEach((button) => {
    button.addEventListener('click', () => openEvidence(button.dataset.file, button));
  });
  $('#closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  return { updateProgress, closeModal };
}
