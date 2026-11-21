// Pure filter logic for the checklist. Kind "missable" is a flag, not a
// stored kind; kind "online" matches nothing — the game has no online
// trophies at launch, so that filter honestly shows the empty state.

export function applyFilters(trophies, f, state) {
  const q = (f.query || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (f.kind === 'missable' && !t.missable) return false;
    if (f.kind === 'online') return false;
    if (f.kind && f.kind !== 'all' && f.kind !== 'missable' && t.kind !== f.kind) return false;
    if (f.grade && f.grade !== 'all' && t.grade !== f.grade) return false;
    if (f.status === 'earned' && !state.earned.includes(t.id)) return false;
    if (f.status === 'unearned' && state.earned.includes(t.id)) return false;
    if (q && !`${t.name} ${t.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
