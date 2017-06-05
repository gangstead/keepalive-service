'use strict';

exports.up = (knex) => {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.createTable('buttons', (t) => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('name').notNullable().comment('Friendly name for this button');
      t.string('type').notNullable().comment('Different devices have different behaviour');
    }));
};

exports.down = (knex) => {
  return knex.schema.dropTable('buttons')
    .then(() => knex.schema.raw('DROP EXTENSION "uuid-ossp" CASCADE'));
};
