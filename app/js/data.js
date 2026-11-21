// Loads the two data files and expands their compact layout into the plain
// trophy objects the views work with. Also owns the hidden-cover rule, which
// every view applies the same way.

export const COVERED_DESC = 'A hidden trophy — covered until you earn it.';

let trophies = [];
let byId = new Map();
let roadmap = null;

function expandTrophy(raw, srcMap) {
  return {
    id: raw.i,
    name: raw.n,
    description: raw.d,
    grade: raw.g,
    kind: raw.k,
    stage: raw.s,
    hidden: raw.h === 1,
    missable: raw.m === 1,
    target: raw.t ? { target: raw.t[0], unit: raw.t[1] } : null,
    sources: (raw.src || []).map((code) => srcMap[code] || code),
    guide: raw.gd || '',
  };
}

export async function loadData() {
  const base = new URL('../data/', import.meta.url);
  const [tr, rm] = await Promise.all([
    fetch(new URL('trophies.json', base)).then((r) => r.json()),
    fetch(new URL('roadmap.json', base)).then((r) => r.json()),
  ]);
  trophies = tr.trophies.map((t) => expandTrophy(t, tr.src || {}));
  byId = new Map(trophies.map((t) => [t.id, t]));
  roadmap = {
    title: rm.title,
    note: rm.note,
    stages: rm.stages.map((s) => ({ id: s.i, name: s.n, trophyIds: s.t, guidance: s.g })),
  };
  return { trophies, roadmap };
}

export const allTrophies = () => trophies;
export const trophyById = (id) => byId.get(id);
export const getRoadmap = () => roadmap;

export const isCovered = (t, state) => t.hidden && !state.earned.includes(t.id);
export const displayName = (t, state) => (isCovered(t, state) ? 'Hidden trophy' : t.name);
export const spoilerMasked = (t, state) =>
  state.hideSpoilers && t.kind === 'story' && !state.earned.includes(t.id) && !isCovered(t, state);
export const SPOILER_DESC = 'Description hidden while Hide spoilers is on.';
export const displayDesc = (t, state) => {
  if (isCovered(t, state)) return COVERED_DESC;
  if (spoilerMasked(t, state)) return SPOILER_DESC;
  return t.description;
};
