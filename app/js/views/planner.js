import { allTrophies, stages, trophy, displayName, gradeLabel, formatCount } from '../data.js';
import { isEarned, counterOf } from '../store.js';
import { esc } from './checklist.js';

function item(t, why, state) {
  return `<button type="button" class="next-item" data-open="${t.id}">
    <span class="next-why">${esc(why)}</span>
    <span class="next-name">${esc(displayName(t, state))}</span>
    <span class="chip grade-${t.grade}">${gradeLabel(t)}</span>
  </button>`;
}

export function renderPlanner(root, ctx) {
  const { state } = ctx;
  const picks = [];
  const used = new Set();
  const add = (t, why) => {
    if (t && !isEarned(t.id) && !used.has(t.id)) {
      picks.push(item(t, why, state));
      used.add(t.id);
    }
  };

  add(trophy(28), 'Missable — do it in Chapter 1, before anything else');

  outer: for (const stage of stages()) {
    for (const id of stage.trophyIds) {
      const t = trophy(id);
      if (t && t.kind === 'story' && !isEarned(t.id)) {
        add(t, `Next story beat — Stage ${stage.id}: ${stage.name}`);
        break outer;
      }
    }
  }

  const counters = allTrophies()
    .filter((t) => t.target && !isEarned(t.id))
    .map((t) => ({ t, pct: counterOf(t.id) / t.target.target }))
    .filter((c) => c.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);
  for (const { t, pct } of counters) {
    add(t, `Counter at ${Math.round(pct * 100)}% — ${formatCount(t, counterOf(t.id))} of ${formatCount(t, t.target.target)} ${t.target.unit === '$' ? '' : t.target.unit}`.trim());
  }

  if (picks.length === 0) {
    add(trophy(2), 'Start here — the opening mission');
    add(trophy(35), 'Start the vehicle counter from hour one');
    add(trophy(42), 'Explore as you go — areas register automatically');
  }

  const earnedCount = allTrophies().filter((t) => isEarned(t.id)).length;
  root.innerHTML = `
    <div class="view-intro">
      <h2>Next Up</h2>
      <p>Your planner, in roadmap order — the missable first, the next story beat,
      then whichever counters you are closest to finishing.
      ${earnedCount} of ${allTrophies().length} trophies earned so far.</p>
    </div>
    <div class="next-list">${picks.join('')}</div>
    <p class="next-note">Finished everything here? Open the Roadmap and work the
    earliest stage that still has unearned trophies.</p>`;

  root.querySelectorAll('[data-open]').forEach((b) =>
    b.addEventListener('click', () => ctx.onOpen(Number(b.dataset.open))),
  );
}
