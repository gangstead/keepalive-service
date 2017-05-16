'use strict';

const tables = [
  'buttons'
];

module.exports = (knex) => knex.raw(`TRUNCATE TABLE ${tables.join(',')} CASCADE`);
