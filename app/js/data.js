// Loads the two data files and normalizes them into the plain objects the
// views work with. trophies.json uses the standard layout (full key names,
// a "sources" legend at the top level); roadmap.json keeps its compact
// layout and is expanded here. Also owns the hidden-cover rule, which every
// view applies the same way.

export const COVERED_DESC = 'A hidden trophy — covered until you earn it.';

let trophies = [];
let byId = new Map();
let roadmap = null;

function normalizeTrophy(raw, srcMap) {
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
    sources: (raw.src || []).map((code) => srcMap[code] || code),
    guide: raw.guide || '',
  };
}

// roadmap.json stays compact on disk (i/n/t/g), so expand each stage into
// the plain shape the roadmap view consumes — the mirror of normalizeTrophy.
function expandStage(raw) {
  return { id: raw.i, name: raw.n, trophyIds: raw.t, guidance: raw.g };
}

export async function loadData() {
  const base = new URL('../data/', import.meta.url);
  const [tr, rm] = await Promise.all([
    fetch(new URL('trophies.json', base)).then((r) => r.json()),
    fetch(new URL('roadmap.json', base)).then((r) => r.json()),
  ]);
  trophies = tr.trophies.map((t) => normalizeTrophy(t, tr.sources || {}));
  byId = new Map(trophies.map((t) => [t.id, t]));
  roadmap = {
    title: rm.title,
    note: rm.note,
    stages: rm.stages.map(expandStage),
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
