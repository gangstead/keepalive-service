var joi = require('joi');

var ping = require('./handlers/pingHandler.js');

var post = require('./handlers/postHandler.js');
var get = require('./handlers/getHandler.js');
var put = require('./handlers/putHandler.js');
var delete = require('./handlers/deleteHandler.js');

var Schema = require('./schemas/Schema.js');

module.exports.register = function (plugin, options, next) {

    plugin.bind({
        config: plugin.app.config
    });

    plugin.route({
        path: "/v1/ping",
        method: "GET",
        handler: ping.handler,
        config: {
            description: 'ping route',
            tags: ['api']
        }
    });

    plugin.route({
        path: "/v1/s/{id?}",
        method: "GET",
        handler: get.handler,
        config: {
            description: 'get ',
            tags: ['api'],
            validate: {
                params: {
                    id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
                },
                query: { 
                }
            },
            plugins: {
                hal: {
                    links: { 
                        'hotel': '/v1/hotels/{_hotel}',
                        'client': '/v1/clients/{_client}'
                    },
                    ignore: ['_hotel','_client', '_id'],
                    prepare: function (rep, next) {

                        
                        next();
                    }
                }
            }
        }
    });

    plugin.route({
        path: "/v1/s",
        method: "POST",
        handler: post.handler,
        config: {
            description: 'add new ',
            tags: ['api'],
            validate: {
                payload: Schema
            }
        }
    });

    plugin.route({
        path: "/v1/s/{id}",
        method: "PUT",
        handler: put.handler,
        config: {
            description: 'update ',
            tags: ['api'],
            validate: {
                payload: Schema,
                params: {
                    id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                }
            }
        }
    });

    plugin.route({
        path: "/v1/s/{id}",
        method: "DELETE",
        handler: delete.handler,
        config: {
            description: 'delete ',
            tags: ['api'],
            validate:{
                params: {
                    id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                }
            }
        }
    });

    next();
};

module.exports.register.attributes = {
    pkg: require('../../package.json')
};
