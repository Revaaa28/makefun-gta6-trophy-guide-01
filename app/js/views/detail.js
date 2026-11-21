// The detail pane. The SOURCES box comes first on purpose: a guide step is
// only worth anything next to the source that backs it, so the sources sit
// above the guide, never below the fold.
import { COVERED_DESC, displayDesc, displayName, isCovered } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderDetail(pane, ctx) {
  const { state } = ctx;
  const t = ctx.trophy;
  if (!t) {
    pane.replaceChildren(el('p', 'empty-state', 'Pick a trophy to see its cited guide.'));
    return;
  }
  const covered = isCovered(t, state);
  const earned = state.earned.includes(t.id);
  const frag = document.createDocumentFragment();

  const sources = el('div', 'sources-box');
  sources.append(el('h3', '', 'SOURCES'));
  const ul = document.createElement('ul');
  for (const s of t.sources) ul.append(el('li', '', s));
  sources.append(ul);
  frag.append(sources);

  const title = el('div', 'row-title');
  const grade = el('span', `chip grade-${t.grade}`, t.grade);
  title.append(grade);
  frag.append(title);
  frag.append(el('h2', '', displayName(t, state)));
  frag.append(el('p', 'detail-desc', displayDesc(t, state)));

  if (covered) {
    frag.append(el('p', 'guide-text', COVERED_DESC));
  } else {
    frag.append(el('p', 'guide-text', t.guide));
  }

  if (t.target && !covered) {
    const n = state.counters[t.id] || 0;
    const stepper = el('div', 'stepper');
    const minus = el('button', '', '−');
    minus.type = 'button';
    minus.addEventListener('click', () => ctx.onCounter(t.id, n - 1));
    const readout = el('span', 'count', `${n.toLocaleString('en-US')} of ${t.target.target.toLocaleString('en-US')} ${t.target.unit}`);
    readout.setAttribute('aria-live', 'polite');
    const plus = el('button', '', '+');
    plus.type = 'button';
    plus.addEventListener('click', () => ctx.onCounter(t.id, n + 1));
    const plus10 = el('button', '', '+10');
    plus10.type = 'button';
    plus10.addEventListener('click', () => ctx.onCounter(t.id, n + 10));
    stepper.append(minus, readout, plus, plus10);
    frag.append(stepper);
  }

  const label = el('label', 'notes-label', 'Your notes');
  const notes = document.createElement('textarea');
  notes.className = 'notes';
  notes.value = state.notes[t.id] || '';
  notes.placeholder = 'Your own route notes for this trophy…';
  notes.setAttribute('aria-label', `Notes for ${t.name}`);
  notes.addEventListener('change', () => ctx.onNote(t.id, notes.value.trim()));
  label.append(notes);
  frag.append(label);

  const toggle = el('button', `earn-toggle${earned ? ' is-earned' : ''}`, earned ? 'Earned — tap to undo' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => ctx.onToggleEarned(t.id));
  frag.append(toggle);

  pane.replaceChildren(frag);
}
