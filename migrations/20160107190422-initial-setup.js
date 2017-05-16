'use strict';

exports.up = (knex) => {
  const functionDef
    = `CREATE OR REPLACE FUNCTION set_updated_at_column()
     RETURNS TRIGGER AS $$
     BEGIN
         NEW.updated_at = now();
         RETURN NEW;
     END;
     $$ language 'plpgsql';`;

  return knex.raw(functionDef);
};

exports.down = () => {

};
