// The missables page. There is exactly one true missable in the game, and
// it gets the red hero card; everything else that merely deserves care is
// a lesser caution below it.

import { trophyById } from '../data.js';
import { counterOf, isEarned } from '../store.js';

export function renderMissables(container, ctx) {
  const { el, state } = ctx;
  const pma = trophyById(28);
  const spots = counterOf(state, 28);
  const spotTarget = pma.target.target;

  const hero = el('section', { class: 'hero' },
    el('h3', {}, '⚠ THE ONE TRUE MISSABLE — Positive Mental Attitude, Chapter 1'),
    el('p', {}, 'One of the 18 meditation spots this trophy counts sits on Lucia\u2019s balcony, and it exists only during Chapter 1. Finish the chapter without meditating there and it is gone: no save, no replay and no New Game+ brings it back, and the Platinum would need a fresh run.'),
    el('p', {}, el('strong', {}, 'Do it before Chapter 1 ends. The other 17 spots stay available all game.')),
    el('p', { class: 'tracker' }, isEarned(state, 28)
      ? `Your tracker: all ${spotTarget} spots meditated — trophy earned.`
      : `Your tracker: ${spots} of ${spotTarget} spots meditated.`),
    el('p', { class: 'source-line' }, `Source: ${pma.sources.find((s) => s.startsWith('Output Lag')) || pma.sources[0]}`),
    el('button', {
      type: 'button',
      class: 'btn primary',
      onclick: () => ctx.go('checklist', 28),
    }, 'Open the full guide'),
  );

  container.replaceChildren(
    el('h2', {}, 'Missables & one-time warnings'),
    el('p', { class: 'lede' }, 'Almost everything in Leonida waits for you — strand finales stay open after the credits, and story missions retry from checkpoints. One thing does not wait.'),
    hero,
    el('h3', {}, 'Lesser cautions — annoying, not fatal'),
    el('div', { class: 'caution' },
      el('h4', {}, 'Race Against Yago is time-sensitive'),
      el('p', {}, 'This Chapter 3 strand, which counts toward Strangers & Freaks, does not wait around once it appears. The moment it shows up, drop what you are doing and run it — the other strands keep, this one may not.')),
    el('div', { class: 'caution' },
      el('h4', {}, 'Save discipline, because there is no way back'),
      el('p', {}, 'GTA VI has no mission replay and no New Game+. Keep a manual save at the start of every chapter and one more before the final mission — 15 manual slots plus the autosave — and never turn cheats on: they disable trophies and saving.')),
  );
}
