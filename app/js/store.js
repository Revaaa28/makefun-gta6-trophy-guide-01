const STORAGE_KEY = 'leonida-legend-v1';
const blank = () => ({ earned: {}, counters: {}, notes: {}, hideSpoilers: false });

let state = blank();
const listeners = new Set();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage full or blocked: the session keeps working in memory */ }
}
function emit() { persist(); for (const fn of listeners) fn(state); }

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      state = { earned: p.earned ?? {}, counters: p.counters ?? {}, notes: p.notes ?? {}, hideSpoilers: Boolean(p.hideSpoilers) };
    }
  } catch { state = blank(); }
  return state;
}

export function getState() { return state; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function isEarned(id) { return Boolean(state.earned[id]); }
export function setEarned(id, on) { if (on) state.earned[id] = true; else delete state.earned[id]; emit(); }
export function counterOf(id) { return state.counters[id] ?? 0; }
export function setCounter(id, value) {
  const v = Math.max(0, Math.floor(Number(value) || 0));
  if (v === 0) delete state.counters[id]; else state.counters[id] = v;
  emit();
}
export function noteOf(id) { return state.notes[id] ?? ''; }
export function setNote(id, text) { if (text) state.notes[id] = text; else delete state.notes[id]; emit(); }
export function spoilersHidden() { return state.hideSpoilers; }
export function setSpoilersHidden(on) { state.hideSpoilers = Boolean(on); emit(); }

export function exportProgress() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-legend-progress.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function importProgress(file) {
  return file.text().then((text) => {
    const p = JSON.parse(text);
    if (typeof p !== 'object' || p === null) throw new Error('not a progress file');
    state = { earned: p.earned ?? {}, counters: p.counters ?? {}, notes: p.notes ?? {}, hideSpoilers: Boolean(p.hideSpoilers) };
    emit();
    return state;
  });
}
