/**
 * Top-level language-pair registry
 *
 * To add a new language pair (e.g. Persian → Hindi):
 * 1. Create  src/data/pairs/fa-hi/
 *            ├── meta.json          (id, name, uiDir, sourceLang, targetLang)
 *            ├── index.js           (imports meta + category files, exports default)
 *            └── categories/
 *                └── <id>.json      (id, icon, title, color, tip, phrases[{source,target,pronounce}])
 * 2. Import the pair below and add it to the `pairs` array
 *
 * ─── Phrase JSON schema ──────────────────────────────────────────────────────
 * {
 *   "id":      string           — unique slug
 *   "icon":    string           — emoji
 *   "title":   string           — display name in the UI language
 *   "color":   string           — hex color
 *   "tip":     string | null    — optional tip shown below the phrase list
 *   "phrases": Array<{
 *     "source":    string       — phrase in source language
 *     "target":    string       — phrase in target language
 *     "pronounce": string       — pronunciation written in source script
 *   }>
 * }
 *
 * ─── meta.json schema ────────────────────────────────────────────────────────
 * {
 *   "id":          string       — e.g. "fa-en"
 *   "name":        string       — display label, e.g. "فارسی ← انگلیسی"
 *   "description": string       — short subtitle shown in the pair picker
 *   "uiDir":       "rtl"|"ltr" — overall page direction
 *   "sourceLang":  { "code", "name", "flag" }
 *   "targetLang":  { "code", "name", "flag" }
 * }
 */

import faEn from './pairs/fa-en/index.js';
// import faHi from './pairs/fa-hi/index.js';   ← uncomment when ready
// import enFa from './pairs/en-fa/index.js';

export const pairs = [
  faEn,
  // faHi,
  // enFa,
];

export const defaultPairId = 'fa-en';
