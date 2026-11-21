// The roadmap: the eight stages in play order, each a card with its
// guidance, a progress bar fed by the player's tracker, and a chip per
// trophy that jumps straight to that trophy's guide in the checklist.

import { displayName, getRoadmap, trophyById } from '../data.js';
import { isEarned } from '../store.js';

export function renderRoadmap(container, ctx) {
  const { el, state } = ctx;
  const roadmap = getRoadmap();

  const cards = roadmap.stages.map((stage) => {
    const done = stage.trophyIds.filter((id) => isEarned(state, id)).length;
    const pct = stage.trophyIds.length ? Math.round((done / stage.trophyIds.length) * 100) : 0;
    const chips = stage.trophyIds.map((id) => {
      const t = trophyById(id);
      return el('button', {
        type: 'button',
        class: 'tchip' + (isEarned(state, id) ? ' done' : ''),
        onclick: () => ctx.go('checklist', id),
      }, displayName(t, state));
    });
    return el('section', { class: 'stage-card' },
      el('h3', {}, el('span', { class: 'stage-no' }, `STAGE ${stage.id}`), stage.name),
      el('p', { class: 'sguide' }, stage.guidance),
      el('div', { class: 'sbar-row' },
        el('div', { class: 'sbar' }, el('div', { class: 'sfill', style: `width:${pct}%` })),
        el('span', { class: 'scount' }, `${done} of ${stage.trophyIds.length} earned`)),
      el('div', { class: 'tchips' }, chips));
  });

  container.replaceChildren(
    el('h2', {}, roadmap.title),
    el('p', { class: 'lede' }, roadmap.note),
    ...cards,
  );
}
