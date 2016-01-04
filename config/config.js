module.exports = {
    server: {
        port: process.env.PORT || 3000,
        options: {}
    },
    mongo: {
        uri: process.env.DB_PORT ? process.env.DB_PORT.replace('tcp', 'mongodb') : '',
        db: process.env.environment === 'test' ? 'test' : ''
    },
    rabbit: {
        uri: process.env.RABBIT_PORT ? process.env.RABBIT_PORT.replace('tcp', 'amqp') : ''
    }
};
