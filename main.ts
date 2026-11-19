// Leonida Legend — hand-in program for the gta6-trophy-guide-01 entry.
//
// The guide itself is the static site under app/ (plain HTML, CSS and ES
// modules, no build step, nothing fetched over the network). This program
// does the handing in: it copies app/ and screenshots/ into the output
// directory and writes dossier.json there with make.fun's vendored library
// (vendor/makefun-frontend.ts — left exactly as the kit ships it, because
// the scorer compares the dossier byte for byte with its own copy's output).
//
// Run it with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (MAKEFUN_OUTPUT_DIR stands in for /output outside the grader's container.)
// Preview the guide itself with:  node serve.ts   →   http://localhost:8080

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(root, 'app'), join(outDir, 'app'), { recursive: true });

mkdirSync(join(outDir, 'screenshots'), { recursive: true });
const shotsDir = join(root, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

// Caps mirror the competition gate: at most 4 screenshots of 256 KiB each,
// at most 993 app files / 48 MiB, dossier text capped at 160 KiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log('Leonida Legend handed in: app/ + screenshots/ copied, dossier.json written to', outDir);
