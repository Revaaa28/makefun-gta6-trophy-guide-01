// The roadmap: eight stages in play order, each with its time guidance and
// a progress bar tied to the checklist.
import { displayName } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderRoadmap(section, ctx) {
  const { state, roadmap } = ctx;
  const frag = document.createDocumentFragment();
  frag.append(el('h2', '', roadmap.title));
  frag.append(el('p', 'roadmap-note', roadmap.note));
  for (const stage of roadmap.stages) {
    const card = el('article', 'stage-card');
    card.append(el('h3', '', `Stage ${stage.id} — ${stage.name}`));
    const done = stage.trophyIds.filter((id) => state.earned.includes(id)).length;
    card.append(el('p', 'stage-guidance', `${done} of ${stage.trophyIds.length} earned`));
    const bar = el('div', 'stage-progress');
    const fill = document.createElement('div');
    fill.style.width = `${stage.trophyIds.length ? (done / stage.trophyIds.length) * 100 : 0}%`;
    bar.append(fill);
    card.append(bar);
    card.append(el('p', 'stage-guidance', stage.guidance));
    const names = stage.trophyIds
      .map((id) => displayName(ctx.byId.get(id), state))
      .join(' · ');
    card.append(el('p', 'stage-trophies', names));
    frag.append(card);
  }
  section.replaceChildren(frag);
}
