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
import faZhMeta from './pairs/fa-zh/meta.json';
import faMsMeta from './pairs/fa-ms/meta.json';
import faThMeta from './pairs/fa-th/meta.json';

export const pairManifest = [
  {
    meta: faEnMeta,
    load: () => import('./pairs/fa-en/index.js'),
  },
  {
    meta: faZhMeta,
    load: () => import('./pairs/fa-zh/index.js'),
  },
  {
    meta: faMsMeta,
    load: () => import('./pairs/fa-ms/index.js'),
  },
  {
    meta: faThMeta,
    load: () => import('./pairs/fa-th/index.js'),
  },
];

export const defaultPairId = 'fa-en';
