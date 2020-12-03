'use strict';

const Create = require('./create');
const RemoveByHouseId = require('./remove-by-house-id');
const Get = require('./get');

module.exports = {
    create: Create,
    removeByHouseId: RemoveByHouseId,
    get: Get
};
