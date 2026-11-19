// Leonida Legend — missables view: the honest short list. One trophy can truly be missed
// (Positive Mental Attitude's Chapter 1 balcony meditation), one event is time-sensitive
// (Race Against Yago, inside Strangers & Freaks), and the rest of the risk is save discipline:
// no mission replay, chapter saves, no cheats. Every claim names its source. A live snapshot of
// every counter closes the page.
import { counterOf } from '../store.js';
import { countedTrophies, formatCount } from '../data.js';

function card(titleText, bodyText, sourceText) {
  const el = document.createElement('article');
  el.className = 'info-card';
  const h = document.createElement('h3');
  h.textContent = titleText;
  const p = document.createElement('p');
  p.textContent = bodyText;
  el.append(h, p);
  if (sourceText) {
    const s = document.createElement('p');
    s.className = 'sources-line';
    const b = document.createElement('b');
    b.textContent = 'Source: ';
    s.append(b, document.createTextNode(sourceText));
    el.append(s);
  }
  return el;
}

export function renderMissables(view, ctx) {
  const { data, state } = ctx;
  view.replaceChildren();
  const title = document.createElement('h2');
  title.className = 'view-title';
  title.textContent = 'Missables & Traps';
  const lede = document.createElement('p');
  lede.className = 'view-lede';
  lede.textContent = 'Almost nothing in Leonida can be missed for good — but the few things that can are exactly the ones a platinum run dies on. Here they are, each with its source.';
  view.append(title, lede);

  const missable = data.byId.get(28);
  const hero = document.createElement('section');
  hero.className = 'missable-hero';
  const hh = document.createElement('h3');
  hh.textContent = '⚠ THE ONE TRUE MISSABLE — Positive Mental Attitude (Chapter 1)';
  const hp = document.createElement('p');
  hp.textContent = missable.guide;
  const hs = document.createElement('p');
  hs.className = 'sources-line';
  const hb = document.createElement('b');
  hb.textContent = 'Sources: ';
  hs.append(hb, document.createTextNode(missable.sources.join(' · ')));
  hero.append(hh, hp, hs);
  view.append(hero);

  const grid = document.createElement('div');
  grid.className = 'card-grid card-grid-4';
  const strangers = data.byId.get(25);
  grid.append(
    card('⏳ TIME-SENSITIVE — Race Against Yago (Strangers & Freaks)', strangers.caution, strangers.sources.join(' · ')),
    card('💾 NO MISSION REPLAY — keep chapter saves', 'There is no mission replay and no New Game Plus. The game offers 15 manual save slots plus one autosave: keep one save at the start of every chapter, one untouched save from just before the final mission, and a Chapter 1 save until Positive Mental Attitude pops.', 'Output Lag — GTA 6 Trophy List guide (Nov 19, 2026)'),
    card('🚫 NO CHEATS on a trophy save', 'Cheats switch off both trophies and saving. Keep one clean save file for the platinum run and never enter a cheat on it.', 'Output Lag — GTA 6 Trophy List guide (Nov 19, 2026)'),
    card('✓ EVERYTHING ELSE WAITS', 'Side-story finales, collectibles, counters and the 100% checklist all stay available after the credits, and work done earlier still counts. If it is not on this page, it cannot be missed.', 'Output Lag — GTA 6 Trophy List guide (Nov 19, 2026)'),
  );
  view.append(grid);

  const countersCard = document.createElement('section');
  countersCard.className = 'info-card';
  countersCard.style.marginTop = '16px';
  const ch = document.createElement('h3');
  ch.textContent = 'Your counters at a glance';
  countersCard.append(ch);
  const table = document.createElement('table');
  table.className = 'counter-table';
  const head = document.createElement('tr');
  for (const label of ['Trophy', 'Your count', 'Target', 'Done']) {
    const th = document.createElement('th');
    th.textContent = label;
    if (label !== 'Trophy') th.className = 'num';
    head.append(th);
  }
  table.append(head);
  for (const trophy of countedTrophies(data)) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = trophy.name;
    const mine = document.createElement('td');
    mine.className = 'num';
    mine.textContent = formatCount(counterOf(state, trophy), trophy.target.unit);
    const target = document.createElement('td');
    target.className = 'num';
    target.textContent = `${formatCount(trophy.target.count, trophy.target.unit)} ${trophy.target.unit}`;
    const pct = document.createElement('td');
    pct.className = 'num';
    pct.textContent = `${Math.min(100, Math.round((counterOf(state, trophy) / trophy.target.count) * 100))}%`;
    tr.append(name, mine, target, pct);
    table.append(tr);
  }
  countersCard.append(table);
  view.append(countersCard);
}
