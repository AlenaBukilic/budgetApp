'use strict';

const UsersRoutes = require('./users');
// const ClientRoutes = require('./client');

exports.routes = [
    ...UsersRoutes,
    // ...ClientRoutes
];