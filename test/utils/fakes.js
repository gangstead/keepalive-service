'use strict';

const _ = require('lodash');
const moment = require('moment');
const uuid = require('uuid');

const randomName = () =>
  [
    _.sample([ 'small', 'big', 'ordinary', 'tiny', 'tasty' ]),
    _.sample([ 'black', 'brown', 'red', 'orange', 'yellow', 'blue', 'indigo', 'violet', 'silver', 'gold' ]),
    _.sample([ 'button', 'bell', 'scale', 'switch', 'toggle', 'dial', 'knob' ]),
    Math.floor(Math.random() * (99)) + 1
  ].join(' ');

const password = () => _.flatten([
  _.times(7, () => _.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ')),
  _.sample('abcdefghijklmnopqrstuvwxyz'),
  _.sample('1234567890'),
  _.sample('~!@#$%^&*()_+-={}|[];:<>?,./')
]).join('');

module.exports = {
  button: (props) => _.merge({
    id: uuid(),
    name: randomName(),
    type: 'bttn',
    user_id: uuid()
  }, props),
  user: (props) => {
    const name = randomName();
    return _.merge({
      id: uuid(),
      name,
      email: `${name.replace(/\ /g, '')}@gangstead.com`,
      password: password()
    }, props);
  },
  newUser: (props) => {
    const name = randomName();
    return _.merge({
      name,
      email: `${name.replace(/\ /g, '')}@gangstead.com`,
      password: password()
    }, props);
  },
  press: (props) => _.merge({
    id: uuid(),
    user_id: uuid(),
    button_id: uuid(),
    press_time: moment().toISOString()
  }, props)
};
