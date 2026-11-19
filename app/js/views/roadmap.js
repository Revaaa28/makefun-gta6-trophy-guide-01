// Leonida Legend — roadmap view: the road to the Platinum in 7 stages plus the stage-0
// save-discipline brief. Each stage shows its trophies, its own earned progress from the same
// saved state, its time note and its key warning. Built from the official descriptions and the
// sources named on the missables page.
import { isEarned } from '../store.js';
import { displayName } from '../data.js';

export function renderRoadmap(view, ctx) {
  const { data, state } = ctx;
  view.replaceChildren();
  const title = document.createElement('h2');
  title.className = 'view-title';
  title.textContent = 'Roadmap to the Platinum';
  const lede = document.createElement('p');
  lede.className = 'view-lede';
  lede.textContent = 'The order to earn them in: story first with the missable handled in Chapter 1, cleanup second, the 100% grind last. About 200 hours end to end (Output Lag, Nov 19 2026). Click any trophy to open its guide.';
  view.append(title, lede);

  for (const stage of data.stages) {
    const card = document.createElement('section');
    card.className = 'stage-card' + (stage.id === 0 ? ' stage-zero' : '');
    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = stage.id === 0 ? '§0' : `§${stage.id}`;
    const h = document.createElement('h3');
    h.textContent = stage.title;
    head.append(num, h);
    const ids = stage.trophyIds;
    if (ids.length) {
      const done = ids.filter((id) => isEarned(state, id)).length;
      const prog = document.createElement('span');
      prog.className = 'stage-progress';
      prog.textContent = `${done}/${ids.length} earned`;
      head.append(prog);
      const track = document.createElement('div');
      track.className = 'progress-track';
      const fill = document.createElement('div');
      fill.className = 'progress-fill';
      fill.style.width = `${Math.round((done / ids.length) * 100)}%`;
      track.append(fill);
      card.append(head, track);
    } else {
      card.append(head);
    }
    const note = document.createElement('p');
    note.className = 'stage-note';
    note.textContent = stage.note;
    const warning = document.createElement('div');
    warning.className = 'stage-warning';
    const wb = document.createElement('b');
    wb.textContent = 'Watch out: ';
    warning.append(wb, document.createTextNode(stage.warning));
    card.append(note, warning);
    if (ids.length) {
      const chips = document.createElement('div');
      chips.className = 'stage-trophies';
      for (const id of ids) {
        const trophy = data.byId.get(id);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'stage-trophy' + (isEarned(state, id) ? ' done' : '');
        chip.textContent = `${isEarned(state, id) ? '✓ ' : ''}${displayName(state, trophy)}`;
        chip.addEventListener('click', () => ctx.goToTrophy(id));
        chips.append(chip);
      }
      card.append(chips);
    }
    view.append(card);
  }
}
