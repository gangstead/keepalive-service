'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const fakes = require('../utils/fakes');
const serverSetup = require('../utils/server-setup');

describe('Buttons route', () => {
  let server;
  let knex;

  before(() => {
    return serverSetup()
      .then((s) => {
        server = s;
        knex = s.plugins.db.knex;
      });
  });

  beforeEach(() => server.clearDb());

  describe('GET /buttons', () => {
    it('should return buttons', () => {
      const buttons = _.times(3, fakes.button);

      return knex('buttons')
        .insert(buttons)
        .then(() => server.inject({
          url: '/buttons'
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 3);
        });
    });
  });
});
