const seeds = require('../seeds/seeds');

exports.register = (server, options, next) => {
    const knexfile = require('../knexfile');

    const knex = require('knex')(knexfile);

    return knex.migrate.latest()
        .then(() => seeds(knex, require('bluebird')))
        .then(() => {
            server.expose('knex',knex);
            server.log(['info','db'], 'Database setup complete');
            next();
        });
}

exports.register.attributes = {
      name: 'db',
      version: require('../package.json').version
};
