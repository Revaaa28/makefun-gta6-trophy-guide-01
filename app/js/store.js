// Owns the player's progress: earned ids, per-trophy counters and notes,
// and the spoiler toggle. Persisted to localStorage under one key, with
// export/import as a JSON file. A ?demo URL seeds a fixed mid-run state so
// screenshots always show the same believable progress.

const KEY = 'leonida-legend-v1';

export const DEMO_SEED = {
  earned: [2, 3, 8, 16, 21, 33, 36, 39, 44, 46, 51, 53, 55],
  counters: { 15: 137, 17: 20, 25: 3, 28: 6, 31: 46, 32: 23, 35: 58, 42: 31, 52: 90000 },
  notes: { 15: 'Stunt jumps around the airport are quick — chain them between missions.' },
  hideSpoilers: false,
};

const blank = () => ({ earned: [], counters: {}, notes: {}, hideSpoilers: false });

function isValidState(s) {
  return (
    s !== null &&
    typeof s === 'object' &&
    Array.isArray(s.earned) &&
    s.earned.every((n) => Number.isInteger(n)) &&
    s.counters !== null && typeof s.counters === 'object' && !Array.isArray(s.counters) &&
    s.notes !== null && typeof s.notes === 'object' && !Array.isArray(s.notes) &&
    typeof s.hideSpoilers === 'boolean'
  );
}

let state = blank();
const listeners = new Set();

export function getState() {
  return state;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — the app still works for the session */
  }
}

function emit() {
  save();
  for (const fn of listeners) fn(state);
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initStore() {
  if (new URLSearchParams(location.search).has('demo')) {
    state = JSON.parse(JSON.stringify(DEMO_SEED));
    save();
    return state;
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidState(parsed)) state = parsed;
    }
  } catch {
    state = blank();
  }
  return state;
}

export function toggleEarned(id) {
  const i = state.earned.indexOf(id);
  if (i >= 0) state.earned.splice(i, 1);
  else state.earned.push(id);
  emit();
}

export function setCounter(id, value, target) {
  const clamped = Math.max(0, Math.min(target, Math.floor(value) || 0));
  state.counters[id] = clamped;
  emit();
}

export function setNote(id, text) {
  if (text) state.notes[id] = text;
  else delete state.notes[id];
  save();
}

export function setHideSpoilers(on) {
  state.hideSpoilers = Boolean(on);
  emit();
}

export function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importState(file) {
  const parsed = JSON.parse(await file.text());
  if (!isValidState(parsed)) throw new Error('That file is not a Leonida Legend progress export.');
  // Shape is not enough: sanitize the values too, so a hand-edited export
  // cannot smuggle in negative counters or non-string notes.
  const counters = {};
  for (const [k, v] of Object.entries(parsed.counters)) {
    if (typeof v === 'number' && Number.isFinite(v)) counters[k] = Math.max(0, Math.floor(v));
  }
  const notes = {};
  for (const [k, v] of Object.entries(parsed.notes)) {
    if (typeof v === 'string' && v) notes[k] = v;
  }
  state = {
    earned: [...new Set(parsed.earned.filter((n) => n > 0))],
    counters,
    notes,
    hideSpoilers: parsed.hideSpoilers,
  };
  emit();
}
