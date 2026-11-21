// Player progress, kept in localStorage under one key. The state shape is
// { earned: number[], counters: {id: number}, notes: {id: string},
//   hideSpoilers: boolean } — counters and notes are keyed by trophy id.

const KEY = 'leonida-legend-v1';

const blank = () => ({ earned: [], counters: {}, notes: {}, hideSpoilers: false });

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    return sanitize(JSON.parse(raw));
  } catch {
    return blank();
  }
}

function sanitize(s) {
  const out = blank();
  if (!s || typeof s !== 'object') return out;
  if (Array.isArray(s.earned)) {
    out.earned = [...new Set(s.earned.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55))];
  }
  if (s.counters && typeof s.counters === 'object') {
    for (const [k, v] of Object.entries(s.counters)) {
      if (Number.isFinite(v) && v >= 0) out.counters[k] = Math.floor(v);
    }
  }
  if (s.notes && typeof s.notes === 'object') {
    for (const [k, v] of Object.entries(s.notes)) {
      if (typeof v === 'string') out.notes[k] = v;
    }
  }
  out.hideSpoilers = s.hideSpoilers === true;
  return out;
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export const isEarned = (state, id) => state.earned.includes(id);

export function toggleEarned(state, id) {
  const at = state.earned.indexOf(id);
  if (at >= 0) state.earned.splice(at, 1);
  else state.earned.push(id);
}

export const counterOf = (state, id) => state.counters[id] || 0;

export function setCounter(state, id, value, target) {
  const cap = target ? target.target : Number.MAX_SAFE_INTEGER;
  const n = Number.isFinite(value) ? Math.floor(value) : 0;
  state.counters[id] = Math.max(0, Math.min(cap, n));
}

export function setNote(state, id, text) {
  if (text) state.notes[id] = text;
  else delete state.notes[id];
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-legend-progress.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 600);
}

export async function importState(file) {
  const parsed = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.earned)) {
    throw new Error('That file is not a Leonida Legend progress export.');
  }
  return sanitize(parsed);
}
