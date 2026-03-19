/**
 * fa-en pair registry — Persian → English
 *
 * To add a new category to this pair:
 * 1. Create ./categories/<id>.json
 * 2. Import it below and add to the array
 */

import meta       from './meta.json';
import price      from './categories/price.json';
import taxi       from './categories/taxi.json';
import hotel      from './categories/hotel.json';
import restaurant from './categories/restaurant.json';
import shopping   from './categories/shopping.json';
import emergency  from './categories/emergency.json';
import general    from './categories/general.json';
import manglish   from './categories/manglish.json';

export default {
  meta,
  categories: [price, taxi, hotel, restaurant, shopping, emergency, general, manglish],
};
