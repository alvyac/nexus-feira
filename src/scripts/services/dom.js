/** Pequenos utilitários DOM compartilhados pelos módulos da interface. */
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function setVisible(element, visible) {
  element.classList.toggle('hidden', !visible);
  if (element.hasAttribute('aria-hidden')) element.setAttribute('aria-hidden', String(!visible));
}

export function appendTextLine(container, text, variant = '') {
  const line = document.createElement('div');
  line.className = ['termline', variant].filter(Boolean).join(' ');
  line.textContent = text;
  container.append(line);
  container.scrollTop = container.scrollHeight;
  return line;
}
