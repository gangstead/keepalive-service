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

    it('should return buttons filtered by type', () => { // FIXME
      const buttons = _.times(3, fakes.button);
      const bttn = fakes.button({ type: 'specialButton' });

      return knex('buttons')
        .insert([ bttn, ...buttons ])
        .then(() => server.inject({
          url: {
            pathname: '/buttons',
            query: { type: 'specialButton' }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 1);
        });
    });

    it('should return an empty array if no buttons match the filter', () => { // FIXME
      const buttons = _.times(3, fakes.button);

      return knex('buttons')
        .insert(buttons)
        .then(() => server.inject({
          url: {
            pathname: '/buttons',
            query: { type: 'specialButton' }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.buttons.length', 0);
        });
    });

    xit('should 401 if not authorized'); // TODO: for when authentication is implemented
  });

  describe('POST /buttons', () => {
    it('should create buttons', () => {
      return knex('buttons')
        .then(() => server.inject({
          method: 'POST',
          url: '/buttons',
          payload: {
            button: {
              name: 'mybutton',
              type: 'bttn'
            }
          }
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.button');
          expect(res.result.button).to.have.all.keys([ 'id', 'name', 'type' ]);
          return knex('buttons');
        })
        .then((buttons) => {
          expect(buttons).to.have.property('length', 1);
          expect(buttons).to.have.deep.property('[0].name', 'mybutton');
        });
    });

    xit('should 401 if not authorized'); // TODO: for when authentication is implemented
  });

  describe('GET /buttons/{buttonId}', () => {
    it('should retrieve a button', () => {
      const button = fakes.button();

      return knex('buttons')
        .insert(button)
        .then(() => server.inject({
          url: `/buttons/${button.id}`
        }))
        .then((res) => {
          expect(res).to.have.property('statusCode', 200);
          expect(res).to.have.deep.property('result.button');
          expect(res.result.button).to.have.all.keys([ 'id', 'name', 'type' ]);
        });
    });

    xit('should 401 if not authorized'); // TODO: for when authentication is implemented
  });
});
