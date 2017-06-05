'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('email').notNullable().unique().comment('used to log in');
    t.string('name').notNullable().comment('for display only');
  })
  .then(() => {
    return knex.schema.table('buttons', (t) => {
      t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
    });
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
