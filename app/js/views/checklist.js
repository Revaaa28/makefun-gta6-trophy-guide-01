// Leonida Legend — checklist view: the tracker itself. All 55 trophies with official names,
// descriptions and grades; checkboxes and counters saved as you go; kind/grade/status filters
// and search; a trophy's guide opens in the detail pane beside the list.
import { isEarned, toggleEarned, counterOf } from '../store.js';
import { gradeLabel, displayName, displayDescription } from '../data.js';
import { KIND_FILTERS, applyFilters } from '../filters.js';
import { renderDetail, counterControls } from './detail.js';

const ONLINE_EMPTY = 'No online trophies at launch — all 55 are single-player (Output Lag, Nov 19 2026).';

export function renderChecklist(view, ctx) {
  const { data, state } = ctx;
  view.replaceChildren();
  const filters = { kind: 'all', grade: 'all', status: 'all', query: '' };
  let selectedId = ctx.selectedId ?? null;

  const title = document.createElement('h2');
  title.className = 'view-title';
  title.textContent = 'Checklist & Guides';
  const lede = document.createElement('p');
  lede.className = 'view-lede';
  lede.textContent = 'Tick trophies off as you earn them — progress, counters and notes save in this browser automatically. Click any trophy to open its cited guide. Press / to search, Esc to close the guide.';
  view.append(title, lede);

  const bar = document.createElement('div');
  bar.className = 'filter-bar';
  const chipRow = document.createElement('div');
  chipRow.className = 'chip-row';
  const rowLabel = document.createElement('span');
  rowLabel.className = 'row-label';
  rowLabel.textContent = 'Show';
  chipRow.append(rowLabel);
  for (const kind of KIND_FILTERS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (kind.id === 'missable' ? ' chip-missable' : '');
    chip.textContent = kind.label;
    chip.dataset.kind = kind.id;
    chip.addEventListener('click', () => {
      filters.kind = kind.id;
      chipRow.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c.dataset.kind === kind.id));
      renderList();
    });
    if (kind.id === 'all') chip.classList.add('active');
    chipRow.append(chip);
  }
  const tools = document.createElement('div');
  tools.className = 'filter-tools';
  const search = document.createElement('input');
  search.type = 'search';
  search.id = 'trophy-search';
  search.placeholder = 'Search trophies, descriptions, guides…  ( / )';
  search.addEventListener('input', () => { filters.query = search.value; renderList(); });
  const gradeSel = document.createElement('select');
  gradeSel.id = 'grade-filter';
  for (const [value, label] of [['all', 'All grades'], ['platinum', 'Platinum'], ['gold', 'Gold'], ['silver', 'Silver'], ['bronze', 'Bronze']]) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    gradeSel.append(opt);
  }
  gradeSel.addEventListener('change', () => { filters.grade = gradeSel.value; renderList(); });
  const statusSel = document.createElement('select');
  statusSel.id = 'status-filter';
  for (const [value, label] of [['all', 'Earned + remaining'], ['earned', 'Earned only'], ['remaining', 'Remaining only']]) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    statusSel.append(opt);
  }
  statusSel.addEventListener('change', () => { filters.status = statusSel.value; renderList(); });
  const showing = document.createElement('span');
  showing.className = 'showing-count';
  tools.append(search, gradeSel, statusSel, showing);
  bar.append(chipRow, tools);
  view.append(bar);

  const split = document.createElement('div');
  split.className = 'split';
  const list = document.createElement('div');
  list.className = 'trophy-list';
  const pane = document.createElement('aside');
  pane.className = 'detail-pane';
  split.append(list, pane);
  view.append(split);

  const openTrophy = (id) => {
    selectedId = id;
    ctx.selectedId = id;
    renderDetail(pane, id ? data.byId.get(id) : null, { ...ctx, openTrophy });
    list.querySelectorAll('.trophy-row').forEach((row) => {
      row.classList.toggle('selected', Number(row.dataset.id) === id);
    });
  };
  ctx.openTrophy = openTrophy;

  function trophyRow(trophy) {
    const row = document.createElement('div');
    row.className = 'trophy-row' + (isEarned(state, trophy.id) ? ' earned' : '');
    row.dataset.id = String(trophy.id);
    if (trophy.id === selectedId) row.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned(state, trophy.id);
    box.title = 'Mark earned';
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      toggleEarned(state, trophy.id);
      row.classList.toggle('earned', isEarned(state, trophy.id));
      ctx.refreshHeader();
      if (selectedId === trophy.id) openTrophy(trophy.id);
    });
    const main = document.createElement('div');
    main.className = 'row-main';
    const name = document.createElement('div');
    name.className = 'row-name';
    name.textContent = displayName(state, trophy);
    if (state.hideSpoilers && trophy.kind === 'story' && !isEarned(state, trophy.id)) name.classList.add('masked-name');
    const desc = document.createElement('div');
    desc.className = 'row-desc';
    desc.textContent = displayDescription(state, trophy);
    const meta = document.createElement('div');
    meta.className = 'row-meta';
    const chip = document.createElement('span');
    chip.className = `grade-chip grade-${trophy.grade}`;
    chip.textContent = gradeLabel(trophy.grade);
    meta.append(chip);
    if (trophy.hidden) {
      const b = document.createElement('span');
      b.className = 'badge badge-hidden';
      b.textContent = 'Hidden';
      meta.append(b);
    }
    if (trophy.missable) {
      const b = document.createElement('span');
      b.className = 'badge badge-missable';
      b.textContent = '⚠ Missable';
      meta.append(b);
    } else if (trophy.caution) {
      const b = document.createElement('span');
      b.className = 'badge badge-caution';
      b.textContent = trophy.id === 25 ? 'Time-sensitive event' : 'Caution';
      meta.append(b);
    }
    const kindB = document.createElement('span');
    kindB.className = 'badge badge-kind';
    kindB.textContent = trophy.kind;
    meta.append(kindB);
    const stageB = document.createElement('span');
    stageB.className = 'badge badge-stage';
    stageB.textContent = `Stage ${trophy.stage}`;
    meta.append(stageB);
    main.append(name, desc, meta);
    if (trophy.target) {
      const pct = Math.min(100, Math.round((counterOf(state, trophy) / trophy.target.count) * 100));
      const track = document.createElement('div');
      track.className = 'mini-track';
      const fill = document.createElement('div');
      fill.className = 'mini-fill';
      fill.style.width = `${pct}%`;
      track.append(fill);
      main.append(track);
    }
    row.append(box, main);
    if (trophy.target) {
      const controls = counterControls(trophy, state, () => { ctx.refreshHeader(); renderList(); });
      controls.addEventListener('click', (e) => e.stopPropagation());
      row.append(controls);
    }
    row.addEventListener('click', () => openTrophy(trophy.id));
    return row;
  }

  function renderList() {
    const shown = applyFilters(data.trophies, state, filters);
    showing.textContent = `Showing ${shown.length} of ${data.trophies.length}`;
    list.replaceChildren();
    if (filters.kind === 'online') {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = ONLINE_EMPTY;
      list.append(empty);
      return;
    }
    if (shown.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No trophies match these filters. Loosen a filter or clear the search.';
      list.append(empty);
      return;
    }
    for (const trophy of shown) list.append(trophyRow(trophy));
  }

  renderList();
  openTrophy(selectedId);
}
