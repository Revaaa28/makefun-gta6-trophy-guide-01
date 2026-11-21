// Missables: one red hero card for the single true missable, then the
// time-sensitive warnings that are worth knowing before they bite.
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderMissables(section, ctx) {
  const { state } = ctx;
  const frag = document.createDocumentFragment();
  frag.append(el('h2', '', 'Missables & time-sensitive moments'));

  const t = ctx.byId.get(28);
  const hero = el('article', 'hero-card');
  hero.append(el('div', 'tag', 'THE ONE TRUE MISSABLE'));
  hero.append(el('h2', '', t.name));
  hero.append(el('p', '', t.description));
  hero.append(el('p', 'guide-text', t.guide));
  if (t.target) {
    const n = state.counters[t.id] || 0;
    const stepper = el('div', 'stepper');
    const minus = el('button', '', '−');
    minus.type = 'button';
    minus.addEventListener('click', () => ctx.onCounter(t.id, n - 1));
    const readout = el('span', 'count', `${n} of ${t.target.target} ${t.target.unit}`);
    readout.setAttribute('aria-live', 'polite');
    const plus = el('button', '', '+');
    plus.type = 'button';
    plus.addEventListener('click', () => ctx.onCounter(t.id, n + 1));
    stepper.append(minus, readout, plus);
    hero.append(stepper);
  }
  frag.append(hero);

  const warnings = [
    {
      title: 'Time-sensitive — Race Against Yago (Chapter 3)',
      body: 'The strand appears once Vice City opens up and does not wait around: run it the moment it shows (Output Lag).',
    },
    {
      title: 'Hourglass quests can expire — but they are safe to skip',
      body: 'Hourglass-marked quests can expire, but they do not count toward trophies, so an expired one never blocks the Platinum (PowerPyx).',
    },
    {
      title: 'Strand finales never expire',
      body: 'The side-story finales — Andy, Kenton, Billy, Randy, Tyrone and Bret — all stay available after the credits, so cleanup can finish them (Output Lag).',
    },
  ];
  for (const w of warnings) {
    const card = el('article', 'warning-card');
    card.append(el('h3', '', w.title), el('p', '', w.body));
    frag.append(card);
  }
  section.replaceChildren(frag);
}
