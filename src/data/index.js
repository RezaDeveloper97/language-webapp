/**
 * Language-pair manifest
 *
 * Only meta.json files are imported here (tiny — no phrase data).
 * The actual category data is loaded ON DEMAND via dynamic import()
 * so each pair becomes a separate JS chunk and is NOT downloaded
 * until the user selects it.
 *
 * ── To add a new pair ────────────────────────────────────────────────────────
 * 1. Create src/data/pairs/<id>/  with meta.json, index.js, categories/
 * 2. import its meta below
 * 3. Add an entry to pairManifest
 * ─────────────────────────────────────────────────────────────────────────────
 */

import faEnMeta from './pairs/fa-en/meta.json';
// import faHiMeta from './pairs/fa-hi/meta.json';
// import enFaMeta from './pairs/en-fa/meta.json';

export const pairManifest = [
  {
    meta: faEnMeta,
    // Dynamic import → Vite bundles this pair into its own chunk
    load: () => import('./pairs/fa-en/index.js'),
  },
  // {
  //   meta: faHiMeta,
  //   load: () => import('./pairs/fa-hi/index.js'),
  // },
];

export const defaultPairId = 'fa-en';
