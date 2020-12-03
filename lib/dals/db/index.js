'use strict';

const Mongoose = require('mongoose');

require('dotenv').config();

const opts = {
    mongoUrl: process.env.MONGO_URL_TEST,
    mongoOptions: {
        config: { autoIndex: false },
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
};

module.exports = {
    init: async () => {

        return Mongoose.connect(opts.mongoUrl, opts.mongoOptions);
    },
    dropDatabase: async () => {

        return Mongoose.connection.dropDatabase();
    },
    close: async () => {

        return Mongoose.disconnect();
    }
};
