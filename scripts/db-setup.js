'use strict';

const knexfile = require('../knexfile');
const db = knexfile.connection.database;
knexfile.connection.database = null;
const knex = require('knex')(knexfile);

return knex.raw(`create database "${db}"`)
  .then(() => console.info(`Database '${db}' created successfully`))
  .catch((e) => e.message.match(/already exists/),
   () => console.error(`Database '${db}' already exists`))
  .finally(() => knex.destroy());
