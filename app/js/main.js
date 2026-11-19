// Leonida Legend — main: boot, header stats, hash routing, and the shared context every view
// renders from. Routes: #/checklist (default), #/trophy/<id> (checklist with that guide open),
// #/roadmap, #/missables, #/planner. Keyboard: "/" focuses the checklist search, Esc closes the
// guide pane.
import { loadState, saveState, isEarned, setHideSpoilers, exportState, importState } from './store.js';
import { loadData, gradeLabel } from './data.js';
import { renderChecklist } from './views/checklist.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner } from './views/planner.js';

const state = loadState();
const data = await loadData();
const viewEl = document.getElementById('view');
const statsEl = document.getElementById('header-stats');
const spoilerToggle = document.getElementById('spoiler-toggle');

const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export function renderHeaderStats() {
  const total = data.trophies.length;
  const earned = data.trophies.filter((t) => isEarned(state, t.id)).length;
  const pct = Math.round((earned / total) * 100);
  statsEl.replaceChildren();
  const big = document.createElement('div');
  big.className = 'stat-big';
  big.textContent = `${earned} `;
  const of = document.createElement('span');
  of.className = 'of';
  of.textContent = `of ${total} trophies earned · ${pct}%`;
  big.append(of);
  const track = document.createElement('div');
  track.className = 'progress-track';
  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.style.width = `${pct}%`;
  track.append(fill);
  const counts = document.createElement('div');
  counts.className = 'grade-counts';
  for (const grade of GRADES) {
    const all = data.trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => isEarned(state, t.id)).length;
    const span = document.createElement('span');
    const b = document.createElement('b');
    b.textContent = `${got}/${all.length}`;
    span.append(b, document.createTextNode(` ${gradeLabel(grade)}`));
    counts.append(span);
  }
  const note = document.createElement('div');
  note.className = 'stat-note';
  note.textContent = '~200 hours to Platinum · 1 missable (Chapter 1) · no online trophies';
  statsEl.append(big, track, counts, note);
}

function markActiveNav(route) {
  document.querySelectorAll('#view-nav a[data-route]').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
}

const ctx = {
  data,
  state,
  selectedId: null,
  refreshHeader: renderHeaderStats,
  refresh: () => route(),
  goToTrophy: (id) => { location.hash = `#/trophy/${id}`; },
  importFromFile: async (file) => {
    if (!file) return;
    try {
      const next = await importState(file);
      state.earned = next.earned;
      state.counters = next.counters;
      state.notes = next.notes;
      state.hideSpoilers = next.hideSpoilers;
      saveState(state);
      spoilerToggle.checked = state.hideSpoilers;
      route();
    } catch {
      window.alert('That file could not be read as a Leonida Legend progress file.');
    }
  },
};

function route() {
  const hash = location.hash || '#/checklist';
  const trophyMatch = hash.match(/^#\/trophy\/(\d+)$/);
  renderHeaderStats();
  if (trophyMatch) {
    ctx.selectedId = Number(trophyMatch[1]);
    markActiveNav('checklist');
    renderChecklist(viewEl, ctx);
  } else if (hash.startsWith('#/roadmap')) {
    markActiveNav('roadmap');
    renderRoadmap(viewEl, ctx);
  } else if (hash.startsWith('#/missables')) {
    markActiveNav('missables');
    renderMissables(viewEl, ctx);
  } else if (hash.startsWith('#/planner')) {
    markActiveNav('planner');
    renderPlanner(viewEl, ctx);
  } else {
    ctx.selectedId = null;
    markActiveNav('checklist');
    renderChecklist(viewEl, ctx);
  }
  window.scrollTo(0, 0);
}

spoilerToggle.checked = state.hideSpoilers;
spoilerToggle.addEventListener('change', () => {
  setHideSpoilers(state, spoilerToggle.checked);
  route();
});
document.getElementById('export-btn').addEventListener('click', () => exportState(state));
document.getElementById('import-file').addEventListener('change', (e) => ctx.importFromFile(e.target.files[0]));

document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
    e.preventDefault();
    if (!location.hash.startsWith('#/checklist') && !location.hash.startsWith('#/trophy')) {
      location.hash = '#/checklist';
      setTimeout(() => document.getElementById('trophy-search')?.focus(), 50);
    } else {
      document.getElementById('trophy-search')?.focus();
    }
  }
  if (e.key === 'Escape' && ctx.openTrophy) ctx.openTrophy(null);
});

window.addEventListener('hashchange', route);
route();
