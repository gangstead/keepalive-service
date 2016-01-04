exports.register = (server, options, next) => {
    server.route({
        method: 'GET',
        path: '/buttons',
        handler: (req, reply) => {
            reply('buttons');
        }
    });
    next();
}


exports.register.attributes = {
    name: require('../package.json').name + '-buttons-route',
    version: require('../package.json').version
};
