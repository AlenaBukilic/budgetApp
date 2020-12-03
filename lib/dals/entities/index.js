'use strict';

const Categories = require('./categories');
const Expenditures = require('./expenditures');
const Houses = require('./houses');
const Incomes = require('./incomes');
const Permissions = require('./permissions');
const Users = require('./users');

module.exports = {
    categories: Categories,
    expenditures: Expenditures,
    houses: Houses,
    incomes: Incomes,
    permissions: Permissions,
    users: Users
};
