// The guide pane: one trophy in full. The SOURCES box always comes first —
// a reader should see where the facts come from before the advice built on
// them. Covered (hidden, unearned) trophies show none of it.

import { COVERED_DESC, displayDesc, displayName, isCovered } from '../data.js';
import { counterOf, isEarned, setCounter, setNote, toggleEarned } from '../store.js';

export const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
export const KIND_LABEL = { story: 'Story', collectibles: 'Collectibles', activities: 'Activities' };

export const fmt = (n) => n.toLocaleString('en-US');

export function progressText(t, state) {
  const n = counterOf(state, t.id);
  if (t.target.unit === '$') return `$${fmt(n)} of $${fmt(t.target.target)}`;
  return `${fmt(n)} of ${fmt(t.target.target)} ${t.target.unit}`;
}

function chip(ctx, text, cls) {
  return ctx.el('span', { class: `chip ${cls || ''}` }, text);
}

// The chip row for a trophy. A covered trophy gets only its grade chip and
// the Hidden chip — kind, stage and missable would give the trophy away.
export function chipsFor(ctx, t, state, { withStatus = false } = {}) {
  const chips = [chip(ctx, GRADE_LABEL[t.grade], `g-${t.grade}`)];
  if (isCovered(t, state)) {
    chips.push(chip(ctx, 'Hidden', 'k-hidden'));
    return chips;
  }
  if (withStatus) {
    chips.push(isEarned(state, t.id)
      ? chip(ctx, 'Earned', 'status-earned')
      : chip(ctx, 'Not earned', ''));
  }
  chips.push(chip(ctx, KIND_LABEL[t.kind], ''));
  chips.push(chip(ctx, `Stage ${t.stage}`, ''));
  if (t.hidden) chips.push(chip(ctx, 'Hidden', 'k-hidden'));
  if (t.missable) chips.push(chip(ctx, 'Missable', 'k-missable'));
  return chips;
}

export function renderDetail(pane, ctx, t, refresh) {
  const { el, state } = ctx;
  pane.replaceChildren();
  if (!t) {
    pane.append(el('p', { class: 'placeholder' }, 'Select a trophy from the list to read its guide.'));
    return;
  }

  const earned = isEarned(state, t.id);
  const toggleBtn = el('button', {
    class: 'btn' + (earned ? '' : ' primary'),
    type: 'button',
    onclick: () => { toggleEarned(state, t.id); ctx.changed(); refresh(); },
  }, earned ? 'Mark as not earned' : 'Mark as earned');

  if (isCovered(t, state)) {
    pane.append(
      el('div', { class: 'pmeta' }, chipsFor(ctx, t, state)),
      el('h3', {}, 'Hidden trophy'),
      el('p', { class: 'pdesc' }, COVERED_DESC),
      el('p', { class: 'guide' }, 'This trophy is hidden on the official list, so its name, description and guide stay covered here until you earn it in the game.'),
      toggleBtn,
    );
    return;
  }

  const head = el('div', { class: 'pmeta' }, chipsFor(ctx, t, state, { withStatus: true }));
  const sources = el('div', { class: 'sources' },
    el('h4', {}, 'SOURCES'),
    el('ul', {}, t.sources.map((s) => el('li', {}, s))),
    el('p', { class: 'closing' }, 'Guide written from the sources above, in our own words.'),
  );

  pane.append(head, el('h3', {}, displayName(t, state)), el('p', { class: 'pdesc' }, displayDesc(t, state)), sources, el('p', { class: 'guide' }, t.guide));

  if (t.target) {
    const label = el('span', { class: 'plabel', 'aria-live': 'polite' }, `Progress: ${progressText(t, state)}`);
    const step = (delta) => () => {
      setCounter(state, t.id, counterOf(state, t.id) + delta, t.target);
      ctx.save();
      refresh();
    };
    pane.append(el('div', { class: 'prow' },
      label,
      el('button', { class: 'stepbtn', type: 'button', 'aria-label': 'Decrease counter', onclick: step(-1) }, '−'),
      el('button', { class: 'stepbtn', type: 'button', 'aria-label': 'Increase counter', onclick: step(1) }, '+'),
      el('button', { class: 'stepbtn wide', type: 'button', 'aria-label': 'Increase counter by ten', onclick: step(10) }, '+10'),
    ));
  }

  const notes = el('textarea', {
    placeholder: 'Your own notes for this trophy…',
    'aria-label': `Your notes for ${t.name}`,
  });
  notes.value = state.notes[t.id] || '';
  notes.addEventListener('input', () => { setNote(state, t.id, notes.value); ctx.save(); });

  pane.append(toggleBtn, el('label', { class: 'notes-label' }, 'Your notes'), notes);
}
