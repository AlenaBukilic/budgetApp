'use strict';

const Budgets = require('./budgets');
const Entities = require('./entities');
const Groups = require('./groups');
const Currencies = require('./currencies');
const Classes = require('./classes');
const Permissions = require('./permissions');

module.exports = {
    budgets: Budgets,
    entities: Entities,
    groups: Groups,
    currencies: Currencies,
    classes: Classes,
    permissions: Permissions
};
