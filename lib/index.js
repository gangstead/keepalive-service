var Hapi = require('hapi');
var config = require('../config/config.js');
var server = new Hapi.Server();

server.connection({
    port: config.server.port,
    routes: {
        cors: true
    }
});

var good_options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        events: {log: '*', response: '*'}
    }]
};

server.register({
        register: require('good'), 
        options: good_options
    }).then(() => server.register( require('../plugins/db'))
    ).then(() => server.register({
        register: require('../routes/buttons'), 
        options: config.server.options
    })).then(() => server.register([
        require('inert'),
        require('vision'),
        require('hapi-swagger'),
        require('blipp')
    ])).then(() => {
        server.start();
        console.log(`Server started at ${server.info.uri}`);
    })
    .catch( (err) => console.log('Server startup err', err));

