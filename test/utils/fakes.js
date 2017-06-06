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

module.exports = {
  button: (props) => _.merge({
    id: uuid(),
    name: randomName(),
    type: 'bttn',
    user_id: uuid()
  }, props),
  user: (props) => _.merge({
    id: uuid(),
    name: randomName(),
    email: `${uuid()}@gangstead.com`
  }, props),
  press: (props) => _.merge({
    id: uuid(),
    user_id: uuid(),
    button_id: uuid(),
    press_time: moment().toISOString()
  }, props)
};
