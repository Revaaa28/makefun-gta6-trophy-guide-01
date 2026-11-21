// Next Up: the next unearned trophies in roadmap order, so the player
// always knows what the game is about to offer them.
import { displayDesc, displayName } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderPlanner(section, ctx) {
  const { state, roadmap } = ctx;
  const frag = document.createDocumentFragment();
  frag.append(el('h2', '', 'Next Up'));
  const stageName = new Map(roadmap.stages.map((s) => [s.id, s.name]));
  const ordered = [...ctx.trophies].sort((a, b) => a.stage - b.stage || a.id - b.id);
  const next = ordered.filter((t) => !state.earned.includes(t.id)).slice(0, 8);
  if (next.length === 0) {
    frag.append(el('p', 'empty-state', 'Everything is earned — Leonida Legend status. Time to touch grass.'));
  }
  for (const t of next) {
    const card = el('article', 'planner-card');
    const title = el('div', 'row-title');
    title.append(el('span', `chip grade-${t.grade}`, t.grade), el('span', '', displayName(t, state)));
    card.append(title);
    card.append(el('p', 'stage-guidance', `Stage ${t.stage} — ${stageName.get(t.stage) || ''}`));
    card.append(el('p', '', displayDesc(t, state)));
    frag.append(card);
  }
  section.replaceChildren(frag);
}
