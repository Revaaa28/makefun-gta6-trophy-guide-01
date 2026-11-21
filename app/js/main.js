// Leonida Legend — app wiring. Loads the data, owns the shared state and
// the header progress, and switches the four views. All rendering lives in
// the view modules; this file only connects them.

import { loadData } from './data.js';
import { makeFilters } from './filters.js';
import { exportState, importState, loadState, saveState } from './store.js';
import { renderChecklist } from './views/checklist.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner } from './views/planner.js';
import { renderRoadmap } from './views/roadmap.js';

// Small DOM builder shared by every view: el('div', {class: 'x', onclick: fn}, kids…)
function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  for (const kid of kids.flat(9)) {
    if (kid === null || kid === undefined) continue;
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

const viewBox = document.getElementById('view');
const hdrProgress = document.getElementById('hdr-progress');
const hdrFill = document.getElementById('hdr-fill');
const spoilerBox = document.getElementById('opt-spoilers');
const fileInput = document.getElementById('file-import');
const tabs = [...document.querySelectorAll('.tab')];

let state = loadState();
let currentView = 'checklist';
let checklistPick = 39; // Sneakthief opens in the pane on first load

const ctx = {
  el,
  get state() { return state; },
  filters: makeFilters(),
  save() { saveState(state); },
  changed() { saveState(state); updateHeader(); },
  go(view, pick) {
    if (pick !== undefined) checklistPick = pick;
    show(view);
  },
};

function updateHeader() {
  const n = state.earned.length;
  const pct = Math.round((n / 55) * 100);
  hdrProgress.textContent = `${n} of 55 trophies earned · ${pct}%`;
  hdrFill.style.width = `${pct}%`;
}

function show(view) {
  currentView = view;
  tabs.forEach((t) => t.classList.toggle('active', t.dataset.view === view));
  viewBox.replaceChildren();
  if (view === 'checklist') renderChecklist(viewBox, ctx, checklistPick);
  else if (view === 'roadmap') renderRoadmap(viewBox, ctx);
  else if (view === 'missables') renderMissables(viewBox, ctx);
  else if (view === 'planner') renderPlanner(viewBox, ctx);
}

tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.view)));

spoilerBox.checked = state.hideSpoilers;
spoilerBox.addEventListener('change', () => {
  state.hideSpoilers = spoilerBox.checked;
  ctx.changed();
  show(currentView);
});

document.getElementById('btn-export').addEventListener('click', () => exportState(state));
document.getElementById('btn-import').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  fileInput.value = '';
  if (!file) return;
  try {
    state = await importState(file);
    saveState(state);
    spoilerBox.checked = state.hideSpoilers;
    updateHeader();
    show(currentView);
  } catch (err) {
    window.alert(`Import failed: ${err.message}`);
  }
});

loadData()
  .then(() => {
    updateHeader();
    show('checklist');
  })
  .catch((err) => {
    viewBox.replaceChildren(el('div', { class: 'empty' }, `The trophy data failed to load (${err.message}). Serve the app over http — see serve.ts — rather than opening the file directly.`));
  });
