// missables.js — the danger page. GTA VI's list is kind in one specific
// way: exactly one thing can be lost forever (Lucia's Chapter 1 balcony
// meditation, inside Positive Mental Attitude), and it gets a red hero
// card with its source printed on it. Everything below it is a caution,
// not a lockout.

import { trophy, displayName } from '../data.js';
import { isEarned, counterOf } from '../store.js';
import { esc } from './checklist.js';

export function renderMissables(root, ctx) {
  const { state } = ctx;
  const pma = trophy(28);
  const earned = isEarned(28);
  const spots = counterOf(28);

  root.innerHTML = `
    <div class="view-intro">
      <h2>Missables &amp; one-time warnings</h2>
      <p>Almost everything in Leonida waits for you — strand finales stay open after the
      credits, and story missions retry from checkpoints. One thing does not wait:</p>
    </div>

    <section class="missable-hero">
      <p class="hero-flag">⚠ THE ONE TRUE MISSABLE</p>
      <h3>${esc(displayName(pma, state))} — Chapter 1</h3>
      <p>Lucia's balcony meditation spot counts toward this trophy's 18 meditation spots,
      and it is only there during Chapter 1. Finish Chapter 1 without it and no save, replay
      or New Game+ (there is none) can bring it back — the Platinum would need a fresh run.</p>
      <p><strong>Do it before Chapter 1 ends.</strong> The other 17 spots stay available all game.</p>
      <p class="hero-status">${earned ? '✓ Earned — crisis averted.' : `Your tracker: ${spots} / 18 spots meditated.`}</p>
      <p class="hero-source">Source: Output Lag — GTA 6 Trophy List guide (Nov 19, 2026)</p>
      <button type="button" class="hero-btn" data-open="28">Open the full guide</button>
    </section>

    <section class="caution-list">
      <h3>Lesser cautions — annoying, not fatal</h3>
      <article class="caution">
        <h4>Race Against Yago is time-sensitive</h4>
        <p>The Chapter 3 stranger strand behind Strangers &amp; Freaks does not wait around.
        The moment it appears on the map, drop everything and run it.</p>
      </article>
      <article class="caution">
        <h4>No mission replay, no New Game+</h4>
        <p>There is no way to redo a finished mission. Keep a manual save at the start of
        every chapter and one before the final mission — 15 manual slots plus autosave
        make it painless, and those saves are your only way back.</p>
      </article>
      <article class="caution">
        <h4>Cheats disable trophies and saving</h4>
        <p>Entering a cheat turns off trophy earning and saving for the session. Play the
        Platinum run clean; keep the chaos for a throwaway save.</p>
      </article>
      <article class="caution">
        <h4>Partner trophies need both of them</h4>
        <p>Hot Together and Retail Therapy only count with Jason and Lucia together,
        which the story allows from Chapter 2. Attempting them solo earns nothing.</p>
      </article>
    </section>`;

  root.querySelector('[data-open]').addEventListener('click', () => ctx.onOpen(28));
}
