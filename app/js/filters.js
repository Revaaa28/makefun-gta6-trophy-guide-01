// filters.js — the checklist's filter state and matching rule.
// Kinds are the guide's own taxonomy (story / missable / collectibles /
// activities) plus an "online" bucket that intentionally matches nothing:
// GTA VI has no online trophies at launch, and the view says so honestly.

export const KIND_FILTERS = [
  { id: 'all', label: 'All kinds' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'activities', label: 'Activities' },
  { id: 'online', label: 'Online' },
];

export const GRADE_FILTERS = [
  { id: 'all', label: 'All grades' },
  { id: 'platinum', label: 'Platinum' },
  { id: 'gold', label: 'Gold' },
  { id: 'silver', label: 'Silver' },
  { id: 'bronze', label: 'Bronze' },
];

export const STATUS_FILTERS = [
  { id: 'all', label: 'Earned + remaining' },
  { id: 'earned', label: 'Earned only' },
  { id: 'remaining', label: 'Remaining only' },
];

export function blankFilters() {
  return { query: '', kind: 'all', grade: 'all', status: 'all' };
}

export function matchesKind(t, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return t.missable === true;
  if (kind === 'online') return false; // no online trophies at launch
  return t.kind === kind;
}

export function matchesFilters(t, f, state) {
  if (!matchesKind(t, f.kind)) return false;
  if (f.grade !== 'all' && t.grade !== f.grade) return false;
  const earned = Boolean(state.earned[t.id]);
  if (f.status === 'earned' && !earned) return false;
  if (f.status === 'remaining' && earned) return false;
  if (f.query) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(f.query.toLowerCase())) return false;
  }
  return true;
}
