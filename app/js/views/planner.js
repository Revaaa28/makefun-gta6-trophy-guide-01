// Leonida Legend — planner view ("Next Up"): what to do next, computed from the saved state.
// Next trophies are the next unearned ones in roadmap order (stage, then id); nearest counters
// are the counted trophies closest to their target by percentage. Settings live here too:
// export, import, the spoiler toggle state, and a full reset behind a confirm.
import { isEarned, counterOf, resetState, exportState } from '../store.js';
import { displayName, displayDescription, countedTrophies, counterPercent, formatCount } from '../data.js';

export function renderPlanner(view, ctx) {
  const { data, state } = ctx;
  view.replaceChildren();
  const title = document.createElement('h2');
  title.className = 'view-title';
  title.textContent = 'Next Up Planner';
  const lede = document.createElement('p');
  lede.className = 'view-lede';
  lede.textContent = 'Your next five trophies in roadmap order, the counters closest to done, and your save-file controls. Everything here reads the same saved progress as the checklist.';
  view.append(title, lede);

  const ordered = [...data.trophies].sort((a, b) => a.stage - b.stage || a.id - b.id);
  const next = ordered.filter((t) => !isEarned(state, t.id)).slice(0, 5);
  const nextTitle = document.createElement('h3');
  nextTitle.textContent = 'Next up — in roadmap order';
  view.append(nextTitle);
  if (next.length === 0) {
    const done = document.createElement('div');
    done.className = 'empty-state';
    done.textContent = 'All 55 earned. Vice City salutes you, Leonida Legend.';
    view.append(done);
  }
  next.forEach((trophy, i) => {
    const item = document.createElement('div');
    item.className = 'nextup-item';
    const rank = document.createElement('div');
    rank.className = 'nextup-rank';
    rank.textContent = String(i + 1);
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'row-name';
    name.textContent = `${displayName(state, trophy)} — Stage ${trophy.stage}`;
    const first = document.createElement('div');
    first.className = 'first-line';
    const masked = state.hideSpoilers && trophy.kind === 'story';
    first.textContent = masked
      ? 'Hidden by the spoiler setting — earn it to reveal its guide.'
      : trophy.guide.split('. ')[0] + '.';
    const desc = document.createElement('div');
    desc.className = 'row-desc';
    desc.textContent = displayDescription(state, trophy);
    body.append(name, desc, first);
    item.append(rank, body);
    item.addEventListener('click', () => ctx.goToTrophy(trophy.id));
    view.append(item);
  });

  const nearTitle = document.createElement('h3');
  nearTitle.style.marginTop = '20px';
  nearTitle.textContent = 'Counters nearest completion';
  view.append(nearTitle);
  const near = countedTrophies(data)
    .filter((t) => !isEarned(state, t.id) && counterOf(state, t) > 0)
    .sort((a, b) => counterPercent(state, b, counterOf) - counterPercent(state, a, counterOf))
    .slice(0, 5);
  if (near.length === 0) {
    const none = document.createElement('p');
    none.className = 'view-lede';
    none.textContent = 'No counters started yet — bump one in the checklist and it will show up here.';
    view.append(none);
  }
  for (const trophy of near) {
    const item = document.createElement('div');
    item.className = 'nextup-item';
    const rank = document.createElement('div');
    rank.className = 'nextup-rank';
    rank.textContent = `${counterPercent(state, trophy, counterOf)}%`;
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'row-name';
    name.textContent = trophy.name;
    const detailLine = document.createElement('div');
    detailLine.className = 'first-line';
    detailLine.textContent = `${formatCount(counterOf(state, trophy), trophy.target.unit)} of ${formatCount(trophy.target.count, trophy.target.unit)} ${trophy.target.unit}`;
    body.append(name, detailLine);
    item.append(rank, body);
    item.addEventListener('click', () => ctx.goToTrophy(trophy.id));
    view.append(item);
  }

  const settings = document.createElement('section');
  settings.className = 'settings-box';
  const sh = document.createElement('h3');
  sh.textContent = 'Save file — export, import, reset';
  const sp = document.createElement('p');
  sp.textContent = `Progress is stored in this browser only. Spoiler setting: Hide spoilers is currently ${state.hideSpoilers ? 'ON — unearned story trophies are masked' : 'OFF — everything is visible'} (toggle it in the header). Export before you clear browser data; import restores checks, counters, notes and settings.`;
  const row = document.createElement('div');
  row.className = 'settings-row';
  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'btn btn-accent';
  exportBtn.textContent = 'Export progress (.json)';
  exportBtn.addEventListener('click', () => exportState(state));
  const importLabel = document.createElement('label');
  importLabel.className = 'btn';
  importLabel.textContent = 'Import progress…';
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = 'application/json';
  importInput.hidden = true;
  importInput.addEventListener('change', () => ctx.importFromFile(importInput.files[0]));
  importLabel.append(importInput);
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn btn-danger';
  resetBtn.textContent = 'Reset everything';
  resetBtn.addEventListener('click', () => {
    if (window.confirm('Reset all Leonida Legend progress, counters, notes and settings? This cannot be undone.')) {
      resetState(state);
      ctx.refresh();
    }
  });
  row.append(exportBtn, importLabel, resetBtn);
  settings.append(sh, sp, row);
  view.append(settings);
}
