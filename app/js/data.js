// Loads the two data files. trophies.json uses the standard schema — its
// "src" codes are resolved to full source names through the file's own
// top-level "sources" legend. roadmap.json stays compact on disk
// ({i, n, t, g} per stage) and is expanded here into plain objects.

export const COVERED_DESC = 'A hidden trophy — covered until you earn it.';
export const SPOILER_DESC = 'Description hidden while Hide spoilers is on.';

let trophies = [];
let byId = new Map();
let roadmap = null;

function expandTrophy(raw, legend) {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    grade: raw.grade,
    kind: raw.kind,
    stage: raw.stage,
    hidden: raw.hidden === true,
    missable: raw.missable === true,
    target: raw.target ? { target: raw.target.target, unit: raw.target.unit } : null,
    sources: (raw.src || []).map((code) => legend[code] || code),
    guide: raw.guide || '',
  };
}

function expandStage(raw) {
  return { id: raw.i, name: raw.n, trophyIds: raw.t, guidance: raw.g };
}

export async function loadData() {
  const base = new URL('../data/', import.meta.url);
  const [tr, rm] = await Promise.all([
    fetch(new URL('trophies.json', base)).then((r) => r.json()),
    fetch(new URL('roadmap.json', base)).then((r) => r.json()),
  ]);
  const legend = tr.sources || {};
  trophies = tr.trophies.map((t) => expandTrophy(t, legend));
  byId = new Map(trophies.map((t) => [t.id, t]));
  roadmap = { title: rm.title, note: rm.note, stages: rm.stages.map(expandStage) };
  return { trophies, roadmap };
}

export const allTrophies = () => trophies;
export const trophyById = (id) => byId.get(id);
export const getRoadmap = () => roadmap;

export const isCovered = (t, state) => t.hidden && !state.earned.includes(t.id);
export const displayName = (t, state) => (isCovered(t, state) ? 'Hidden trophy' : t.name);
export const spoilerMasked = (t, state) =>
  state.hideSpoilers && t.kind === 'story' && !state.earned.includes(t.id) && !isCovered(t, state);
export const displayDesc = (t, state) => {
  if (isCovered(t, state)) return COVERED_DESC;
  if (spoilerMasked(t, state)) return SPOILER_DESC;
  return t.description;
};
