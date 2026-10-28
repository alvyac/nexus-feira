/** Formata segundos como MM:SS. */
export function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Retorna um identificador hexadecimal curto para a sessão fictícia. */
export function createSessionId(random = Math.random) {
  return random().toString(16).slice(2, 8).toUpperCase().padEnd(6, '0');
}
