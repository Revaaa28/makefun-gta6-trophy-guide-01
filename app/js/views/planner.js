// Next Up: a queue computed from the player's own progress. The missable
// leads while it is unearned, the next story beat follows, and then the
// counters closest to done — the shortest wins first.

import { allTrophies, displayName, isCovered } from '../data.js';
import { counterOf, isEarned } from '../store.js';
import { fmt } from './detail.js';

export function renderPlanner(container, ctx) {
  const { el, state } = ctx;
  const all = allTrophies();
  const rows = [];

  const row = (t, hint) => el('button', {
    type: 'button',
    class: 'prow-item',
    onclick: () => ctx.go('checklist', t.id),
  },
    el('span', { class: 'pname' }, displayName(t, state)),
    el('span', { class: 'phint' }, hint),
  );

  const missable = all.find((t) => t.missable);
  if (missable && !isEarned(state, missable.id)) {
    const n = counterOf(state, missable.id);
    rows.push(row(missable, n > 0
      ? `${n} of ${missable.target.target} spots meditated — and the Chapter 1 balcony spot cannot be recovered once the chapter ends.`
      : 'Chapter 1 only: the balcony meditation spot vanishes for good when the chapter ends.'));
  }

  const nextStory = all
    .filter((t) => t.kind === 'story' && !isEarned(state, t.id))
    .sort((a, b) => a.stage - b.stage || a.id - b.id)[0];
  if (nextStory) {
    rows.push(row(nextStory, isCovered(nextStory, state)
      ? `Next story beat — a hidden trophy in stage ${nextStory.stage}. It uncovers when you earn it.`
      : `Next story beat — stage ${nextStory.stage} of the roadmap.`));
  }

  const counters = all
    .filter((t) => t.target && !t.missable && !isEarned(state, t.id))
    .map((t) => ({ t, pct: counterOf(state, t.id) / t.target.target }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);
  for (const { t, pct } of counters) {
    const n = counterOf(state, t.id);
    const amount = t.target.unit === '$'
      ? `$${fmt(n)} of $${fmt(t.target.target)}`
      : `${fmt(n)} of ${fmt(t.target.target)} ${t.target.unit}`;
    rows.push(row(t, `${amount} — ${Math.round(pct * 100)}% of the way there.`));
  }

  container.replaceChildren(
    el('h2', {}, 'Next Up Planner'),
    el('p', { class: 'lede' }, 'Your planner, in roadmap order — the missable first, the next story beat, then whichever counters you are closest to finishing.'),
    ...(rows.length ? rows : [el('div', { class: 'empty' }, 'Everything is earned. Leonida is yours — the Platinum included.')]),
    el('p', { class: 'closing-note' }, 'Finished everything here? Open the Roadmap and work the earliest stage that still has unearned trophies.'),
  );
}
