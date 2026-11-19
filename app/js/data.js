// Leonida Legend — data: loads the trophy list and the roadmap, and answers questions about them.
import { isEarned } from './store.js';

export async function loadData() {
  const [trophyDoc, roadmapDoc] = await Promise.all([
    fetch('data/trophies.json').then((r) => r.json()),
    fetch('data/roadmap.json').then((r) => r.json()),
  ]);
  const trophies = trophyDoc.trophies;
  const byId = new Map(trophies.map((t) => [t.id, t]));
  return { trophyDoc, trophies, byId, stages: roadmapDoc.stages };
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function stageOf(data, trophy) {
  return data.stages.find((s) => s.id === trophy.stage) ?? null;
}

// The spoiler rule: with Hide spoilers on, an unearned story trophy shows neither its name nor
// its description (nor its guide) until it is earned.
export function isMasked(state, trophy) {
  return state.hideSpoilers && trophy.kind === 'story' && !isEarned(state, trophy.id);
}

export function displayName(state, trophy) {
  return isMasked(state, trophy) ? 'Hidden trophy' : trophy.name;
}

export function displayDescription(state, trophy) {
  return isMasked(state, trophy)
    ? 'A story trophy. Its name and description stay hidden until you earn it — or turn off Hide spoilers.'
    : trophy.description;
}

export function countedTrophies(data) {
  return data.trophies.filter((t) => t.target);
}

export function counterPercent(state, trophy, counterOf) {
  if (!trophy.target) return 0;
  return Math.min(100, Math.round((counterOf(state, trophy) / trophy.target.count) * 100));
}

export function formatCount(value, unit) {
  const num = value.toLocaleString('en-US');
  return unit && unit.startsWith('dollars') ? `$${num}` : num;
}
