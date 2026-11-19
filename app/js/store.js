// store.js — the localStorage progress store: earned trophies, counters, notes and settings, plus export/import.
// Leonida Legend — store: the saved tracker state (earned, counters, notes, spoiler setting).
// Everything lives in one localStorage key as JSON, so export is a single download of that object
// and import restores checks, counters, notes and settings in one step.
export const STORAGE_KEY = 'leonida-legend-v1';

const blankState = () => ({ earned: {}, counters: {}, notes: {}, hideSpoilers: false });

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    return {
      earned: parsed.earned ?? {},
      counters: parsed.counters ?? {},
      notes: parsed.notes ?? {},
      hideSpoilers: Boolean(parsed.hideSpoilers),
    };
  } catch {
    return blankState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isEarned(state, id) {
  return Boolean(state.earned[id]);
}

export function toggleEarned(state, id) {
  if (state.earned[id]) delete state.earned[id];
  else state.earned[id] = true;
  saveState(state);
}

export function counterOf(state, trophy) {
  const value = Number(state.counters[trophy.id] ?? 0);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function setCounter(state, trophy, value) {
  const clean = Math.max(0, Math.floor(Number(value) || 0));
  state.counters[trophy.id] = trophy.target ? Math.min(clean, trophy.target.count) : clean;
  if (trophy.target && state.counters[trophy.id] >= trophy.target.count) state.earned[trophy.id] = true;
  saveState(state);
  return state.counters[trophy.id];
}

export function setNote(state, id, text) {
  if (text) state.notes[id] = text;
  else delete state.notes[id];
  saveState(state);
}

export function setHideSpoilers(state, on) {
  state.hideSpoilers = Boolean(on);
  saveState(state);
}

export function resetState(state) {
  const fresh = blankState();
  state.earned = fresh.earned;
  state.counters = fresh.counters;
  state.notes = fresh.notes;
  state.hideSpoilers = fresh.hideSpoilers;
  saveState(state);
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-legend-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function importState(file) {
  const parsed = JSON.parse(await file.text());
  if (typeof parsed !== 'object' || parsed === null) throw new Error('not a progress file');
  return {
    earned: parsed.earned ?? {},
    counters: parsed.counters ?? {},
    notes: parsed.notes ?? {},
    hideSpoilers: Boolean(parsed.hideSpoilers),
  };
}
