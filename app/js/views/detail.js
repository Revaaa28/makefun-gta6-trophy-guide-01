// Leonida Legend — detail view: one trophy's full guide in the pane beside the checklist.
// Shows the official name/description/grade, the atlas's own-words guide, any missable or caution
// banner, its counter progress, its roadmap stage, its cited sources, and a personal note.
import { isEarned, setCounter, setNote, counterOf } from '../store.js';
import { gradeLabel, stageOf, isMasked, displayName, displayDescription, formatCount } from '../data.js';

export function counterControls(trophy, state, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'counter-box';
  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.title = 'One less';
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = String(trophy.target.count);
  input.value = String(counterOf(state, trophy));
  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.title = 'One more';
  const target = document.createElement('span');
  target.className = 'counter-target';
  target.textContent = `/ ${formatCount(trophy.target.count, trophy.target.unit)} ${trophy.target.unit}`;
  const apply = (value) => {
    input.value = String(setCounter(state, trophy, value));
    if (onChange) onChange();
  };
  minus.addEventListener('click', (e) => { e.stopPropagation(); apply(counterOf(state, trophy) - stepOf(trophy)); });
  plus.addEventListener('click', (e) => { e.stopPropagation(); apply(counterOf(state, trophy) + stepOf(trophy)); });
  input.addEventListener('click', (e) => e.stopPropagation());
  input.addEventListener('change', () => apply(Number(input.value)));
  wrap.append(minus, input, plus, target);
  return wrap;
}

function stepOf(trophy) {
  return trophy.target.count >= 10000 ? 1000 : 1;
}

export function renderDetail(pane, trophy, ctx) {
  const { data, state } = ctx;
  pane.replaceChildren();
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'detail-desc';
    p.textContent = 'Pick any trophy in the list to read its guide here — what to do, where and how, when it can be missed, and the sources each fact comes from.';
    const h = document.createElement('h2');
    h.textContent = 'Guide pane';
    pane.append(h, p);
    return;
  }
  const masked = isMasked(state, trophy);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'btn detail-close';
  close.textContent = 'Close ✕';
  close.addEventListener('click', () => ctx.openTrophy(null));

  const meta = document.createElement('div');
  meta.className = 'row-meta';
  const chip = document.createElement('span');
  chip.className = `grade-chip grade-${trophy.grade}`;
  chip.textContent = gradeLabel(trophy.grade);
  meta.append(chip);
  if (trophy.hidden) {
    const b = document.createElement('span');
    b.className = 'badge badge-hidden';
    b.textContent = 'Hidden on PSN';
    meta.append(b);
  }
  const kind = document.createElement('span');
  kind.className = 'badge badge-kind';
  kind.textContent = trophy.kind;
  meta.append(kind);
  const stage = stageOf(data, trophy);
  if (stage) {
    const s = document.createElement('span');
    s.className = 'badge badge-stage';
    s.textContent = `Roadmap stage ${stage.id} — ${stage.title}`;
    meta.append(s);
  }
  if (isEarned(state, trophy.id)) {
    const done = document.createElement('span');
    done.className = 'badge';
    done.textContent = '✓ Earned';
    meta.append(done);
  }

  const h = document.createElement('h2');
  h.textContent = displayName(state, trophy);
  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = displayDescription(state, trophy);
  pane.append(close, meta, h, desc);

  if (trophy.missable) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-missable';
    const b = document.createElement('b');
    b.textContent = '⚠ Missable — ';
    alert.append(b, document.createTextNode(trophy.caution ?? 'This trophy can be missed. Read the guide before you play on.'));
    pane.append(alert);
  } else if (trophy.caution) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-caution';
    const b = document.createElement('b');
    b.textContent = 'Caution — ';
    alert.append(b, document.createTextNode(trophy.caution));
    pane.append(alert);
  }

  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = masked
    ? 'Guide hidden by the spoiler setting: earn this story trophy to reveal it, or turn off Hide spoilers in the header.'
    : trophy.guide;
  pane.append(guide);

  if (trophy.target) {
    const label = document.createElement('p');
    label.className = 'note-label';
    label.textContent = `Your count — ${trophy.target.unit}`;
    pane.append(label, counterControls(trophy, state, () => ctx.refresh()));
    const pct = Math.min(100, Math.round((counterOf(state, trophy) / trophy.target.count) * 100));
    const track = document.createElement('div');
    track.className = 'mini-track';
    const fill = document.createElement('div');
    fill.className = 'mini-fill';
    fill.style.width = `${pct}%`;
    track.append(fill);
    pane.append(track);
  }

  const noteLabel = document.createElement('label');
  noteLabel.className = 'note-label';
  noteLabel.textContent = 'Your note for this trophy';
  const note = document.createElement('textarea');
  note.className = 'note-area';
  note.placeholder = 'e.g. two card sets done, third is the Vice City set…';
  note.value = state.notes[trophy.id] ?? '';
  note.addEventListener('input', () => setNote(state, trophy.id, note.value));
  pane.append(noteLabel, note);

  const sources = document.createElement('p');
  sources.className = 'sources-line';
  const sb = document.createElement('b');
  sb.textContent = 'Sources: ';
  sources.append(sb, document.createTextNode(trophy.sources.join(' · ')));
  pane.append(sources);
}
