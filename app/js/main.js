// main.js — wires Leonida Legend together: header stats, the four views
// (Checklist, Roadmap, Missables, Next Up), the guide pane, spoiler toggle,
// export/import, and the keyboard shortcuts (/ searches, Esc closes).

import { loadData, allTrophies } from './data.js';
import {
  load,
  getState,
  subscribe,
  setEarned,
  setSpoilersHidden,
  exportProgress,
  importProgress,
} from './store.js';
import { blankFilters } from './filters.js';
import { renderChecklist } from './views/checklist.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner } from './views/planner.js';
import { renderDetail } from './views/detail.js';

const VIEWS = [
  { id: 'checklist', label: 'Checklist & Guides' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'missables', label: 'Missables' },
  { id: 'planner', label: 'Next Up Planner' },
];

let view = 'checklist';
let filters = blankFilters();
let selectedId = null;
let keepSearchFocus = false;

const headerEl = document.getElementById('site-header');
const navEl = document.getElementById('view-nav');
const mainEl = document.getElementById('view-root');
const paneEl = document.getElementById('detail-pane');

function gradeCounts(state) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of allTrophies()) if (state.earned[t.id]) counts[t.grade] += 1;
  return counts;
}

function renderHeader() {
  const state = getState();
  const total = allTrophies().length;
  const earned = allTrophies().filter((t) => state.earned[t.id]).length;
  const g = gradeCounts(state);
  const pct = total ? Math.round((earned / total) * 100) : 0;
  headerEl.innerHTML = `
    <div class="brand">
      <h1>Leonida Legend</h1>
      <p class="tagline">The GTA VI trophy atlas — all ${total} official PS5 trophies, each with a cited guide in our own words.</p>
    </div>
    <div class="header-stats">
      <p class="big-count">${earned} of ${total} trophies earned · ${pct}%</p>
      <p class="grade-counts">${g.platinum} Platinum · ${g.gold} Gold · ${g.silver} Silver · ${g.bronze} Bronze · about 200 hours to Platinum</p>
      <div class="bar header-bar"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div class="header-actions">
        <label class="spoiler-toggle">
          <input type="checkbox" id="spoiler-toggle"${state.hideSpoilers ? ' checked' : ''}> Hide spoilers
        </label>
        <button type="button" id="export-btn" class="btn">Export progress</button>
        <button type="button" id="import-btn" class="btn">Import progress</button>
        <input type="file" id="import-file" accept="application/json" hidden>
      </div>
    </div>`;

  headerEl.querySelector('#spoiler-toggle').addEventListener('change', (e) =>
    setSpoilersHidden(e.target.checked),
  );
  headerEl.querySelector('#export-btn').addEventListener('click', exportProgress);
  const fileInput = headerEl.querySelector('#import-file');
  headerEl.querySelector('#import-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) importProgress(file).catch(() => alert('That file is not a Leonida Legend progress export.'));
  });
}

function renderNav() {
  navEl.innerHTML = VIEWS.map(
    (v) =>
      `<button type="button" class="nav-btn${view === v.id ? ' nav-on' : ''}" data-view="${v.id}">${v.label}</button>`,
  ).join('');
  navEl.querySelectorAll('[data-view]').forEach((b) =>
    b.addEventListener('click', () => {
      view = b.dataset.view;
      render();
    }),
  );
}

function ctx() {
  return {
    state: getState(),
    filters,
    keepSearchFocus,
    onFilters: (f, opts = {}) => {
      filters = f;
      keepSearchFocus = Boolean(opts.keepFocus);
      render();
      keepSearchFocus = false;
    },
    onToggle: (id, on) => setEarned(id, on),
    onOpen: (id) => {
      selectedId = id;
      render();
    },
    onClose: () => {
      selectedId = null;
      render();
    },
    selectedId,
  };
}

function render() {
  renderHeader();
  renderNav();
  const c = ctx();
  if (view === 'checklist') renderChecklist(mainEl, c);
  else if (view === 'roadmap') renderRoadmap(mainEl, c);
  else if (view === 'missables') renderMissables(mainEl, c);
  else renderPlanner(mainEl, c);
  renderDetail(paneEl, c);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && selectedId !== null) {
    selectedId = null;
    render();
  }
  if (e.key === '/' && view === 'checklist') {
    const tag = document.activeElement?.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
      e.preventDefault();
      document.getElementById('search')?.focus();
    }
  }
});

async function boot() {
  load();
  try {
    await loadData();
  } catch (err) {
    mainEl.innerHTML = `<div class="empty-state"><h3>Could not load the trophy data</h3><p>${String(err)}</p></div>`;
    return;
  }
  subscribe(render);
  render();
}

boot();
