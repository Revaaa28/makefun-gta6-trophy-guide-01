// data.js — loads the trophy list and roadmap; answers the small questions
// every view asks: what is this trophy, what stage, is it covered/masked,
// how do its numbers read.

let trophies = [];
let byId = new Map();
let roadmap = { title: '', stages: [] };
let stageById = new Map();

export async function loadData() {
  const [tRes, rRes] = await Promise.all([fetch('data/trophies.json'), fetch('data/roadmap.json')]);
  if (!tRes.ok) throw new Error(`trophies.json: HTTP ${tRes.status}`);
  if (!rRes.ok) throw new Error(`roadmap.json: HTTP ${rRes.status}`);
  const tJson = await tRes.json();
  roadmap = await rRes.json();
  trophies = tJson.trophies ?? [];
  byId = new Map(trophies.map((t) => [t.id, t]));
  stageById = new Map();
  for (const stage of roadmap.stages) for (const id of stage.trophyIds) stageById.set(id, stage);
  return { trophies, roadmap };
}

export function allTrophies() { return trophies; }
export function trophy(id) { return byId.get(id); }
export function stages() { return roadmap.stages; }

export function stageOf(t) { return stageById.get(t.id) ?? roadmap.stages[t.stage] ?? null; }
export function stageName(t) { const s = stageOf(t); return s ? `Stage ${s.id}` : ''; }

// A hidden trophy stays fully covered — name, description and context —
// until it is earned, whatever the spoiler toggle says.
export function isCovered(t, state) {
  return Boolean(t.hidden && !state.earned[t.id]);
}

// The spoiler toggle additionally masks unearned story trophies.
export function isMasked(t, state) {
  return Boolean(state.hideSpoilers && t.kind === 'story' && !state.earned[t.id]);
}

export function displayName(t, state) {
  return isCovered(t, state) || isMasked(t, state) ? 'Hidden trophy' : t.name;
}

export function displayDescription(t, state) {
  if (isCovered(t, state)) return 'A hidden trophy — covered until you earn it.';
  return isMasked(t, state) ? 'A story trophy, hidden until you earn it.' : t.description;
}

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
export function gradeLabel(t) { return GRADE_LABEL[t.grade] ?? t.grade; }
export function kindLabel(t) { return t.kind.charAt(0).toUpperCase() + t.kind.slice(1); }

export function formatCount(t, n) {
  return t.target && t.target.unit === '$' ? '$' + n.toLocaleString('en-US') : String(n);
}
export function formatTarget(t) {
  if (!t.target) return '';
  return `${formatCount(t, t.target.target)} ${t.target.unit === '$' ? '' : t.target.unit}`.trim();
}
