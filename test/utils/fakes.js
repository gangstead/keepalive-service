'use strict';

const _ = require('lodash');
const uuid = require('uuid');

const randomName = () =>
  [
    _.sample('small', 'big', 'ordinary', 'tiny', 'tasty'),
    _.sample('black', 'brown', 'red', 'orange', 'yellow', 'blue', 'indigo', 'violet', 'silver', 'gold'),
    _.sample('button', 'bell', 'scale', 'switch', 'toggle', 'dial', 'knob'),
    Math.floor(Math.random() * (99)) + 1
  ].join(' ');

module.exports = {
  button: (props) => _.merge({
    id: uuid(),
    name: randomName(),
    type: 'bttn'
  }, props)
};
