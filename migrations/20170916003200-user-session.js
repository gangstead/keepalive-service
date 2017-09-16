'use strict';

exports.updatedAtTrigger = (knex, table) => knex.raw(`
  CREATE TRIGGER set_updated_at_${table}
  BEFORE UPDATE ON ${table}
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
`);

exports.up = (knex) => {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    .then(() => knex.raw(
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
           NEW.updated_at = now();
           RETURN NEW;
        END;
        $$ language 'plpgsql';`
    ))
    .then(() => {
      return knex.schema.table('users', (t) => {
        t.string('password').notNullable();
        t.datetime('created_at').defaultTo(knex.fn.now());
        t.datetime('updated_at').defaultTo(knex.fn.now());
        t.datetime('deleted_at');
      });
    })
    .then(() => exports.updatedAtTrigger(knex, 'users'));
};

exports.down = (knex) => {
  return knex.schema.raw('DROP EXTENSION "pgcrypto" CASCADE')
    .then(() => {
      return knex.schema.table('users', (t) => {
        t.dropColumn('password');
        t.dropColumn('deleted_at');
      });
    });
};
