/**
 * Category Registry
 *
 * To add a new category:
 * 1. Create a new JSON file under ./categories/  (e.g. airport.json)
 * 2. Import it here and add it to the array below
 *
 * JSON schema for each file:
 * {
 *   "id":      string   — unique slug
 *   "icon":    string   — emoji
 *   "title":   string   — display name (can be any language)
 *   "color":   string   — hex color used in the UI
 *   "tip":     string | null  — optional tip shown at the bottom of the category
 *   "phrases": Array<{ fa, en, pronounce }>
 * }
 */

import price      from './categories/price.json';
import taxi       from './categories/taxi.json';
import hotel      from './categories/hotel.json';
import restaurant from './categories/restaurant.json';
import shopping   from './categories/shopping.json';
import emergency  from './categories/emergency.json';
import general    from './categories/general.json';
import manglish   from './categories/manglish.json';

export const categories = [
  price,
  taxi,
  hotel,
  restaurant,
  shopping,
  emergency,
  general,
  manglish,
];
