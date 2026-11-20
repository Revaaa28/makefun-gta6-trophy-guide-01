// detail.js — the guide pane for one trophy.
// Layout matters: name and description first, then — at the very top,
// before a single word of advice — the SOURCES box naming where the
// trophy's data and guide facts come from, and a status line saying whether
// the guide is fully sourced or partly our own advice the game has not
// confirmed yet. Then the guide itself, a counter stepper with an
// "x of N" readout for counted trophies, the earned toggle, and the
// player's private notes — stepper and notes both persist via the store.

import { trophy, displayName, displayDescription, gradeLabel, kindLabel, stageName, formatCount, isCovered } from '../data.js';
import { isEarned, setEarned, counterOf, setCounter, noteOf, setNote } from '../store.js';
import { esc } from './checklist.js';

export function renderDetail(root, ctx) {
  const t = trophy(ctx.selectedId);
  if (!t) {
    root.innerHTML = '';
    root.classList.remove('pane-open');
    return;
  }
  root.classList.add('pane-open');
  const { state } = ctx;
  const earned = isEarned(t.id);
  const covered = isCovered(t, state);

  const sourceLines = (t.sources ?? []).map((s) => `<li>${esc(s)}</li>`).join('');
  const unchecked = (t.guide ?? '').includes('not yet pinned down');
  const statusLine = unchecked
    ? '<p class="src-status src-warn">⚠ OUR OWN ADVICE — NOT YET CHECKED IN THE GAME</p>'
    : '<p class="src-status">Guide written from the sources above, in our own words</p>';

  const unit = t.target ? (t.target.unit === '$' ? '' : ' ' + esc(t.target.unit)) : '';
  const stepper = t.target
    ? `<div class="stepper">
         <span class="stepper-label">Progress: <strong>${formatCount(t, counterOf(t.id))} of ${formatCount(t, t.target.target)}</strong>${unit}</span>
         <button type="button" class="step-btn" data-step="-1" aria-label="Decrease">−</button>
         <button type="button" class="step-btn" data-step="1" aria-label="Increase">+</button>
         <button type="button" class="step-btn step-big" data-step="10">+10</button>
       </div>`
    : '';

  // A covered trophy's pane head leaks nothing either: grade + Hidden only.
  const paneChips = covered
    ? `<span class="chip grade-${t.grade}">${gradeLabel(t)}</span>
       <span class="chip chip-hidden">Hidden</span>`
    : `<span class="chip grade-${t.grade}">${gradeLabel(t)}</span>
       <span class="chip">${kindLabel(t)}</span>
       ${t.hidden ? '<span class="chip chip-hidden">Hidden</span>' : ''}
       ${t.missable ? '<span class="chip chip-missable">Missable</span>' : ''}
       <span class="chip chip-stage">${stageName(t)}</span>`;

  root.innerHTML = `
    <div class="pane-head">
      <div class="pane-chips">${paneChips}</div>
      <button type="button" class="pane-close" data-close aria-label="Close guide">Close ✕</button>
    </div>
    <p class="pane-earned">${earned ? '✓ Earned' : 'Not yet earned'}</p>
    <h2 class="pane-name">${esc(displayName(t, state))}</h2>
    <p class="pane-desc">${esc(displayDescription(t, state))}</p>

    <div class="sources-box">
      <h3 class="sources-title">SOURCES</h3>
      <ul class="sources-list">${sourceLines}</ul>
      ${statusLine}
    </div>

    <div class="pane-guide">${esc(t.guide)}</div>
    ${stepper}
    <label class="pane-check">
      <input type="checkbox" data-earned${earned ? ' checked' : ''}> Mark as earned
    </label>
    <label class="notes-label" for="note-box">Your notes</label>
    <textarea id="note-box" class="notes" rows="3" placeholder="Spots found, cars still missing, anything…">${esc(noteOf(t.id))}</textarea>`;

  root.querySelector('[data-close]').addEventListener('click', () => ctx.onClose());
  root.querySelector('[data-earned]').addEventListener('change', (e) => setEarned(t.id, e.target.checked));
  root.querySelectorAll('[data-step]').forEach((b) =>
    b.addEventListener('click', () => setCounter(t.id, counterOf(t.id) + Number(b.dataset.step))),
  );
  const noteBox = root.querySelector('#note-box');
  noteBox.addEventListener('change', () => setNote(t.id, noteBox.value.trim()));
}
