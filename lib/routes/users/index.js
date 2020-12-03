'use strict';

const Controllers = require('./controllers');
const user = Controllers.user;

module.exports = [
    { method: 'GET', path: '/api/users', config: user.get },
    { method: 'POST', path: '/api/users', config: user.create },
    { method: 'GET', path: '/api/users/{id}', config: user.findOne },
    { method: 'PATCH', path: '/api/users/{id}', config: user.update },
    { method: 'DELETE', path: '/api/users/{id}', config: user.delete }
];