'use strict';

const Hapi = require('@hapi/hapi');
const Mongoose = require('mongoose');

require('dotenv').config();

const opts = {
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
};

console.log('connecting to db:', opts.mongoUrl);
Mongoose.connect(opts.mongoUrl, opts.mongoOptions);
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected.');
});

const server = new Hapi.server({
    port: process.env.PORT || '5000',
    host: 'localhost'
});

(async () => {

    // await server.register(Inert);

    // server.route({
    //     method: 'GET',
    //     path: '/{parmas*}',
    //     config: {
    //         auth: false
    //     },
    //     handler: {
    //         directory: {
    //             path: 'public',
    //             index: ['index.html']
    //         }
    //     }
    // });

    // await server.route(Routes);

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server running at: ${server.info.uri}`);
})();
