// Leonida Legend — filters: the checklist's kind chips, grade and status selects, and search.
// Pure functions over the trophy list plus the saved state; the checklist view owns the controls.
import { isEarned } from './store.js';

export const KIND_FILTERS = [
  { id: 'all', label: 'All kinds' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'activities', label: 'Activities' },
  { id: 'online', label: 'Online' },
];

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return Boolean(trophy.missable || trophy.caution);
  if (kind === 'online') return trophy.kind === 'online';
  return trophy.kind === kind;
}

export function applyFilters(trophies, state, filters) {
  const query = (filters.query ?? '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (!matchesKind(trophy, filters.kind)) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.status === 'earned' && !isEarned(state, trophy.id)) return false;
    if (filters.status === 'remaining' && isEarned(state, trophy.id)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}
