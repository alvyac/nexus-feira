/** Áudio sintético opcional. Nenhum arquivo ou serviço externo é acessado. */
export function createAudioService() {
  let context = null;
  let ambientNodes = [];
  let ambientGain = null;

  function beep(enabled, frequency = 440, duration = 0.08, waveform = 'sine') {
    if (!enabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      context ??= new AudioContextClass();
      if (context.state === 'suspended') void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = waveform;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.045, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch {
      // Áudio é um recurso opcional; a experiência continua sem ele.
    }
  }

  function radioBurst(enabled, duration = 0.22) {
    if (!enabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      context ??= new AudioContextClass();
      if (context.state === 'suspended') void context.resume();
      const length = Math.max(1, Math.floor(context.sampleRate * duration));
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      filter.type = 'bandpass';
      filter.frequency.value = 1250 + Math.random() * 900;
      filter.Q.value = 0.8;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.055, context.currentTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start();
      source.stop(context.currentTime + duration);
    } catch {
      // Ruído de rádio é decorativo e pode não estar disponível em todos os navegadores.
    }
  }

  function setAmbient(enabled) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      context ??= new AudioContextClass();
      if (context.state === 'suspended') void context.resume();
      if (enabled && ambientNodes.length === 0) {
        ambientGain = context.createGain();
        ambientGain.gain.setValueAtTime(0.0001, context.currentTime);
        ambientGain.gain.exponentialRampToValueAtTime(0.012, context.currentTime + 1.2);
        ambientGain.connect(context.destination);
        for (const [frequency, type, level] of [[47, 'sine', 0.45], [71, 'triangle', 0.18]]) {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = type;
          oscillator.frequency.value = frequency;
          gain.gain.value = level;
          oscillator.connect(gain);
          gain.connect(ambientGain);
          oscillator.start();
          ambientNodes.push(oscillator);
        }
      } else if (!enabled && ambientNodes.length) {
        const nodes = ambientNodes;
        ambientNodes = [];
        const fadingGain = ambientGain;
        fadingGain?.gain.setTargetAtTime(0.0001, context.currentTime, 0.08);
        window.setTimeout(() => {
          nodes.forEach((node) => { try { node.stop(); } catch { /* já parado */ } });
          fadingGain?.disconnect();
          if (ambientGain === fadingGain) ambientGain = null;
        }, 450);
      }
    } catch {
      // O ambiente sonoro é opcional e nunca deve bloquear a investigação.
    }
  }


  return { beep, setAmbient, radioBurst };
}
