'use strict';

const Create = require('./create');
const FindById = require('./find-by-id');
const GetByIds = require('./get-by-ids');
const Remove = require('./remove');

module.exports = {
    create: Create,
    findById: FindById,
    getByIds: GetByIds,
    remove: Remove
};
