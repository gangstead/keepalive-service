'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('presses', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
    t.uuid('button_id').notNullable().references('buttons.id').onDelete('CASCADE');
    t.datetime('press_time').notNullable().defaultTo(knex.fn.now()).comment('Time event occured');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('presses');
};
