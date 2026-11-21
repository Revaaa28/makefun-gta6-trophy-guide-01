// Filter state for the checklist and the predicate a trophy is tested
// against. Kinds are story / collectibles / activities, plus two virtual
// kinds: "missable" (the trophies flagged missable) and "online" (which
// matches nothing — there are no online trophies at launch).

export const KIND_CHIPS = [
  ['all', 'All kinds'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectibles', 'Collectibles'],
  ['activities', 'Activities'],
  ['online', 'Online'],
];

export const GRADE_OPTIONS = [
  ['all', 'All grades'],
  ['platinum', 'Platinum'],
  ['gold', 'Gold'],
  ['silver', 'Silver'],
  ['bronze', 'Bronze'],
];

export const STATUS_OPTIONS = [
  ['all', 'Earned + remaining'],
  ['earned', 'Earned'],
  ['remaining', 'Remaining'],
];

export function makeFilters() {
  return { kind: 'all', grade: 'all', status: 'all', query: '' };
}

export function matches(t, f, state) {
  if (f.kind === 'online') return false;
  if (f.kind === 'missable') {
    if (!t.missable) return false;
  } else if (f.kind !== 'all' && t.kind !== f.kind) {
    return false;
  }
  if (f.grade !== 'all' && t.grade !== f.grade) return false;
  const earned = state.earned.includes(t.id);
  if (f.status === 'earned' && !earned) return false;
  if (f.status === 'remaining' && earned) return false;
  if (f.query) {
    const hay = `${t.name} ${t.description}`.toLowerCase();
    if (!hay.includes(f.query.trim().toLowerCase())) return false;
  }
  return true;
}
