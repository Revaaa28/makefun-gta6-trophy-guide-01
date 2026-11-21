// The checklist: filter row on top, trophy rows on the left, the guide pane
// stuck to the right. Rows carry the tracker (checkbox, counter readout);
// the pane carries the reading (sources, guide, stepper, notes).

import { allTrophies, displayDesc, displayName, isCovered, trophyById } from '../data.js';
import { GRADE_OPTIONS, KIND_CHIPS, STATUS_OPTIONS, matches } from '../filters.js';
import { counterOf, isEarned, toggleEarned } from '../store.js';
import { chipsFor, fmt, renderDetail } from './detail.js';

export function renderChecklist(container, ctx, selectedId) {
  const { el, state, filters } = ctx;
  let selected = selectedId ?? 39;

  const bar = el('div', { class: 'filters' });
  const listBox = el('div', {});
  const pane = el('aside', { class: 'pane' });
  const showing = el('span', { class: 'showing' });

  function refresh() {
    renderList();
    renderDetail(pane, ctx, trophyById(selected), refresh);
  }

  function renderList() {
    const all = allTrophies();
    const visible = all.filter((t) => matches(t, filters, state));
    showing.textContent = `Showing ${visible.length} of ${all.length}`;
    if (filters.kind === 'online') {
      listBox.replaceChildren(el('div', { class: 'empty' },
        'No online trophies at launch — every trophy on the official list is earned offline, so this filter has nothing to show.'));
      return;
    }
    if (!visible.length) {
      listBox.replaceChildren(el('div', { class: 'empty' }, 'No trophies match those filters. Loosen one and the list comes back.'));
      return;
    }
    listBox.replaceChildren(...visible.map(rowFor));
  }

  function rowFor(t) {
    const earned = isEarned(state, t.id);
    const covered = isCovered(t, state);
    const box = el('input', { type: 'checkbox', 'aria-label': `Mark ${displayName(t, state)} as earned` });
    box.checked = earned;
    box.addEventListener('change', () => { toggleEarned(state, t.id); ctx.changed(); refresh(); });

    const meta = el('div', { class: 'tmeta' }, chipsFor(ctx, t, state));
    if (t.target && !covered) {
      meta.append(el('span', { class: 'tcount' }, `${fmt(counterOf(state, t.id))} / ${fmt(t.target.target)} ${t.target.unit}`));
    }
    const row = el('div', {
      class: 'trow' + (earned ? ' done' : '') + (t.id === selected ? ' sel' : ''),
      'data-tid': String(t.id),
    },
      box,
      el('div', { class: 'tmain' },
        el('div', { class: 'tname' }, displayName(t, state)),
        el('div', { class: 'tdesc' }, displayDesc(t, state)),
        meta),
    );
    row.addEventListener('click', (ev) => {
      if (ev.target === box) return;
      selected = t.id;
      refresh();
    });
    return row;
  }

  // Filter row: SHOW label, kind chips, search, grade + status selects.
  bar.append(el('span', { class: 'show-label' }, 'SHOW'));
  for (const [value, label] of KIND_CHIPS) {
    const b = el('button', {
      type: 'button',
      class: 'fchip' + (filters.kind === value ? ' on' : ''),
      onclick: () => {
        filters.kind = value;
        bar.querySelectorAll('.fchip').forEach((c) => c.classList.toggle('on', c === b));
        renderList();
      },
    }, label);
    bar.append(b);
  }
  const search = el('input', { type: 'search', placeholder: 'Search trophies and descriptions', 'aria-label': 'Search trophies' });
  search.value = filters.query;
  search.addEventListener('input', () => { filters.query = search.value; renderList(); });

  const gradeSel = el('select', { 'aria-label': 'Filter by grade' },
    GRADE_OPTIONS.map(([v, l]) => el('option', { value: v }, l)));
  gradeSel.value = filters.grade;
  gradeSel.addEventListener('change', () => { filters.grade = gradeSel.value; renderList(); });

  const statusSel = el('select', { 'aria-label': 'Filter by status' },
    STATUS_OPTIONS.map(([v, l]) => el('option', { value: v }, l)));
  statusSel.value = filters.status;
  statusSel.addEventListener('change', () => { filters.status = statusSel.value; renderList(); });

  bar.append(search, gradeSel, statusSel, showing);
  container.replaceChildren(bar, el('div', { class: 'cols' }, listBox, pane));
  refresh();
}
