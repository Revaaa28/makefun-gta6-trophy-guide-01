// The checklist: every trophy as a row. Hidden trophies you have not earned
// are fully covered — name, description and chips all withheld — whatever
// the spoiler toggle says.
import { displayDesc, displayName, isCovered } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function chip(text, cls) {
  return el('span', `chip ${cls || ''}`.trim(), text);
}

export function renderChecklist(listEl, showingEl, ctx, visible) {
  const { state } = ctx;
  showingEl.textContent =
    visible.length === 0 && ctx.filters.kind === 'online'
      ? 'No online trophies at launch — GTA VI ships as a single-player list, so this filter is honestly empty.'
      : `Showing ${visible.length} of ${ctx.trophies.length} trophies`;
  listEl.replaceChildren(
    ...visible.map((t) => {
      const covered = isCovered(t, state);
      const earned = state.earned.includes(t.id);
      const row = el('li', `trophy-row${earned ? ' is-earned' : ''}${ctx.selectedId === t.id ? ' is-selected' : ''}`);
      row.dataset.id = String(t.id);

      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = earned;
      box.setAttribute('aria-label', `Mark ${t.name} as earned`);
      box.addEventListener('click', (e) => e.stopPropagation());
      box.addEventListener('change', () => ctx.onToggleEarned(t.id));
      row.append(box);

      const main = el('div', 'row-main');
      const title = el('div', 'row-title');
      title.append(chip(t.grade, `grade-${t.grade}`), el('span', '', displayName(t, state)));
      main.append(title, el('div', 'row-desc', displayDesc(t, state)));

      const chips = el('div', 'row-chips');
      if (covered) {
        chips.append(chip('Hidden', 'chip-hidden'));
      } else {
        chips.append(chip(t.kind), chip(`Stage ${t.stage}`));
        if (t.hidden) chips.append(chip('Hidden', 'chip-hidden'));
        if (t.missable) chips.append(chip('Missable', 'chip-missable'));
      }
      main.append(chips);
      row.append(main);
      row.addEventListener('click', () => ctx.onSelect(t.id));
      // Keyboard parity with the mouse: rows are focusable and Enter/Space
      // selects. Keys aimed at the checkbox inside the row are left to it.
      row.tabIndex = 0;
      row.addEventListener('keydown', (e) => {
        if (e.target !== row) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ctx.onSelect(t.id);
        }
      });
      return row;
    }),
  );
}
