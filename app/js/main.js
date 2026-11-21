// Wiring: loads the data, seeds the store, renders every view, and keeps
// the header progress honest. One render pass redraws everything from the
// single state object, so the views can never disagree with each other.
import { allTrophies, getRoadmap, loadData, trophyById } from './data.js';
import { applyFilters } from './filters.js';
import {
  exportState, getState, importState, initStore, setCounter, setHideSpoilers,
  setNote, subscribe, toggleEarned,
} from './store.js';
import { renderChecklist } from './views/checklist.js';
import { renderDetail } from './views/detail.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner } from './views/planner.js';
import { renderRoadmap } from './views/roadmap.js';

const $ = (sel) => document.querySelector(sel);

let selectedId = 39; // Sneakthief — its cited guide is the cover shot.
const filters = { kind: 'all', grade: 'all', status: 'all', query: '' };

function ctx() {
  const trophies = allTrophies();
  return {
    state: getState(),
    trophies,
    roadmap: getRoadmap(),
    byId: new Map(trophies.map((t) => [t.id, t])),
    trophy: trophyById(selectedId),
    selectedId,
    filters,
    onSelect(id) {
      selectedId = id;
      render();
    },
    onToggleEarned: (id) => toggleEarned(id),
    onCounter: (id, value) => {
      const t = trophyById(id);
      if (t && t.target) setCounter(id, value, t.target.target);
    },
    onNote: (id, text) => setNote(id, text),
  };
}

function renderHeader() {
  const state = getState();
  const trophies = allTrophies();
  $('#progress-count').textContent = `${state.earned.length} of ${trophies.length}`;
  const tally = (grade) =>
    trophies.filter((t) => t.grade === grade && state.earned.includes(t.id)).length;
  $('#progress-tallies').textContent =
    `Platinum ${tally('platinum')} · Gold ${tally('gold')} · Silver ${tally('silver')} · Bronze ${tally('bronze')}`;
  $('#hide-spoilers').checked = state.hideSpoilers;
}

function render() {
  const c = ctx();
  renderHeader();
  const visible = applyFilters(c.trophies, filters, c.state);
  renderChecklist($('#trophy-list'), $('#showing'), c, visible);
  renderDetail($('#detail-pane'), c);
  renderRoadmap($('#view-roadmap'), c);
  renderMissables($('#view-missables'), c);
  renderPlanner($('#view-planner'), c);
}

function wire() {
  $('#search').addEventListener('input', (e) => {
    filters.query = e.target.value;
    const c = ctx();
    renderChecklist($('#trophy-list'), $('#showing'), c, applyFilters(c.trophies, filters, c.state));
  });
  $('#filter-kind').addEventListener('change', (e) => { filters.kind = e.target.value; render(); });
  $('#filter-grade').addEventListener('change', (e) => { filters.grade = e.target.value; render(); });
  $('#filter-status').addEventListener('change', (e) => { filters.status = e.target.value; render(); });
  $('#hide-spoilers').addEventListener('change', (e) => setHideSpoilers(e.target.checked));
  $('#export-btn').addEventListener('click', exportState);
  const file = $('#import-file');
  $('#import-btn').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    if (!file.files[0]) return;
    try {
      await importState(file.files[0]);
    } catch (err) {
      alert(err.message);
    }
    file.value = '';
  });
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('is-active', b === tab));
      for (const view of ['checklist', 'roadmap', 'missables', 'planner']) {
        $(`#view-${view}`).hidden = view !== tab.dataset.view;
      }
    });
  }
  subscribe(render);
}

await loadData();
initStore();
wire();
render();
