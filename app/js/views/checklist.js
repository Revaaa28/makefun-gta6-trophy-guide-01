// checklist.js — the tracker view: search, kind/grade/status filters and
// the 55 trophy rows. Rows show official name and description, grade, kind,
// hidden and roadmap-stage chips, and live counter progress where a trophy
// counts toward a target.

import {
  KIND_FILTERS,
  GRADE_FILTERS,
  STATUS_FILTERS,
  matchesFilters,
} from '../filters.js';
import {
  allTrophies,
  displayName,
  displayDescription,
  gradeLabel,
  kindLabel,
  stageName,
  formatCount,
} from '../data.js';
import { isEarned, counterOf } from '../store.js';

export function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function chips(t) {
  const out = [
    `<span class="chip grade-${t.grade}">${gradeLabel(t)}</span>`,
    `<span class="chip">${kindLabel(t)}</span>`,
  ];
  if (t.hidden) out.push('<span class="chip chip-hidden">Hidden</span>');
  if (t.missable) out.push('<span class="chip chip-missable">Missable</span>');
  out.push(`<span class="chip chip-stage">${stageName(t)}</span>`);
  return out.join(' ');
}

function counterBit(t, state) {
  if (!t.target) return '';
  const cur = counterOf(t.id);
  const pct = Math.min(100, Math.round((cur / t.target.target) * 100));
  return `<span class="row-counter">${formatCount(t, cur)} / ${formatCount(t, t.target.target)} ${t.target.unit === '$' ? '' : esc(t.target.unit)} · ${pct}%</span>`;
}

export function renderChecklist(root, ctx) {
  const { state, filters } = ctx;
  const list = allTrophies().filter((t) => matchesFilters(t, filters, state));

  const kindBtns = KIND_FILTERS.map(
    (k) =>
      `<button type="button" class="pill${filters.kind === k.id ? ' pill-on' : ''}" data-kind="${k.id}">${k.label}</button>`,
  ).join('');

  const gradeOpts = GRADE_FILTERS.map(
    (g) => `<option value="${g.id}"${filters.grade === g.id ? ' selected' : ''}>${g.label}</option>`,
  ).join('');
  const statusOpts = STATUS_FILTERS.map(
    (s) => `<option value="${s.id}"${filters.status === s.id ? ' selected' : ''}>${s.label}</option>`,
  ).join('');

  let body = '';
  if (filters.kind === 'online') {
    body = `<div class="empty-state">
      <h3>No online trophies at launch</h3>
      <p>The official list is entirely single-player: no online, difficulty or medal trophies.
      This filter stays here so the answer is one click away instead of a rumour.</p>
    </div>`;
  } else if (list.length === 0) {
    body = `<div class="empty-state">
      <h3>Nothing matches</h3>
      <p>No trophies fit that combination. Loosen a filter or clear the search.</p>
    </div>`;
  } else {
    body =
      '<div class="rows">' +
      list
        .map((t) => {
          const earned = isEarned(t.id);
          return `<article class="row${earned ? ' row-earned' : ''}" data-open="${t.id}">
            <label class="row-check" title="Mark earned">
              <input type="checkbox" data-toggle="${t.id}"${earned ? ' checked' : ''}>
            </label>
            <div class="row-main">
              <h3 class="row-name">${esc(displayName(t, state))}</h3>
              <p class="row-desc">${esc(displayDescription(t, state))}</p>
              <div class="row-chips">${chips(t)}</div>
            </div>
            <div class="row-side">${counterBit(t, state)}</div>
          </article>`;
        })
        .join('') +
      '</div>';
  }

  root.innerHTML = `
    <section class="toolbar">
      <div class="toolbar-row">
        <span class="toolbar-label">Show</span>
        <div class="pill-group">${kindBtns}</div>
      </div>
      <div class="toolbar-row">
        <input id="search" class="search" type="search" placeholder="Search trophies, descriptions, guides…  ( / )"
               value="${esc(filters.query)}" autocomplete="off">
        <select id="grade-filter" class="select">${gradeOpts}</select>
        <select id="status-filter" class="select">${statusOpts}</select>
        <span class="showing">Showing ${list.length} of ${allTrophies().length}</span>
      </div>
    </section>
    ${body}`;

  root.querySelectorAll('[data-kind]').forEach((b) =>
    b.addEventListener('click', () => ctx.onFilters({ ...filters, kind: b.dataset.kind })),
  );
  const search = root.querySelector('#search');
  search.addEventListener('input', () => {
    ctx.onFilters({ ...filters, query: search.value }, { keepFocus: true });
  });
  root.querySelector('#grade-filter').addEventListener('change', (e) =>
    ctx.onFilters({ ...filters, grade: e.target.value }),
  );
  root.querySelector('#status-filter').addEventListener('change', (e) =>
    ctx.onFilters({ ...filters, status: e.target.value }),
  );
  root.querySelectorAll('[data-toggle]').forEach((box) =>
    box.addEventListener('change', (e) => {
      e.stopPropagation();
      ctx.onToggle(Number(box.dataset.toggle), box.checked);
    }),
  );
  root.querySelectorAll('[data-open]').forEach((row) =>
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-toggle]')) return;
      ctx.onOpen(Number(row.dataset.open));
    }),
  );
  if (ctx.keepSearchFocus) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
}
