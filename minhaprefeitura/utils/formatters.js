/**
 * Utilitários puros de formatação e normalização de texto/data.
 */

const HTML_ENTITIES = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

/**
 * Converte HTML simples retornado pela API em texto plano legível preservando parágrafos.
 * @param {string | null | undefined} html
 * @returns {string}
 */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let text = html
    .replace(/\r\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<\/(div|li|h[1-6]|blockquote)>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '');

  for (const [entity, replacement] of Object.entries(HTML_ENTITIES)) {
    text = text.split(entity).join(replacement);
  }

  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Normaliza texto para buscas sem diferenciar maiúsculas/minúsculas ou acentos.
 * @param {string | null | undefined} text
 * @returns {string}
 */
export function normalizeSearchText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Formata uma data ISO (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ssZ`) para `DD/MM/YYYY` sem deslocamento de fuso.
 * @param {string | null | undefined} isoString
 * @returns {string}
 */
export function formatDatePtBr(isoString) {
  if (!isoString || typeof isoString !== 'string') {
    return '';
  }

  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const year = parsed.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formata intervalo relativo em português (ex: "Há 2 horas") com fallback para data completa.
 * @param {string | null | undefined} isoString
 * @param {Date} [now]
 * @returns {string}
 */
export function formatRelativeTime(isoString, now = new Date()) {
  if (!isoString || typeof isoString !== 'string') {
    return '';
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return formatDatePtBr(isoString);
  }

  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) {
    return formatDatePtBr(isoString);
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) {
    return 'Agora mesmo';
  }
  if (diffMinutes < 60) {
    return `Há ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays <= 7) {
    return `Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  }

  return formatDatePtBr(isoString);
}

/**
 * Gera protocolo padronizado (ex: `RAD-2026-0007`, `AGD-2026-0003`).
 * @param {string} prefix
 * @param {number} sequence
 * @param {number} [year]
 * @returns {string}
 */
export function generateProtocol(prefix, sequence, year = 2026) {
  const cleanPrefix = String(prefix || 'SOL').trim().toUpperCase();
  const paddedSequence = String(Math.max(1, Number(sequence) || 1)).padStart(4, '0');
  return `${cleanPrefix}-${year}-${paddedSequence}`;
}
