'use strict';

const tables = [
  'buttons',
  'users'
];

module.exports = (knex) => knex.raw(`TRUNCATE TABLE ${tables.join(',')} CASCADE`);
