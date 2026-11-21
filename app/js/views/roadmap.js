import { stages, trophy, displayName, gradeLabel } from '../data.js';
import { isEarned } from '../store.js';
import { esc } from './checklist.js';

export function renderRoadmap(root, ctx) {
  const { state } = ctx;
  const blocks = stages()
    .map((stage) => {
      const list = stage.trophyIds.map((id) => trophy(id)).filter(Boolean);
      const done = list.filter((t) => isEarned(t.id)).length;
      const pct = list.length ? Math.round((done / list.length) * 100) : 0;
      const rows = list
        .map((t) => {
          const earned = isEarned(t.id);
          return `<button type="button" class="stage-trophy${earned ? ' is-earned' : ''}" data-open="${t.id}">
            <span class="st-check">${earned ? '✓' : '○'}</span>
            <span class="st-name">${esc(displayName(t, state))}</span>
            <span class="chip grade-${t.grade}">${gradeLabel(t)}</span>
          </button>`;
        })
        .join('');
      return `<section class="stage-card">
        <header class="stage-head">
          <h3><span class="stage-num">Stage ${stage.id}</span> — ${esc(stage.name)}</h3>
          <span class="stage-count">${done}/${list.length} earned</span>
        </header>
        <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
        <p class="stage-guidance">${esc(stage.guidance)}</p>
        <div class="stage-list">${rows}</div>
      </section>`;
    })
    .join('');

  root.innerHTML = `
    <div class="view-intro">
      <h2>Roadmap to the Platinum</h2>
      <p>Eight stages in the order the game lets you play them. The story is short;
      the counters are the long road — start them early and the endgame stays sane.</p>
    </div>
    ${blocks}`;

  root.querySelectorAll('[data-open]').forEach((b) =>
    b.addEventListener('click', () => ctx.onOpen(Number(b.dataset.open))),
  );
}
