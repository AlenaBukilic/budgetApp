'use strict';

const Create = require('./create');
const FindBySubjectIdObjectId = require('./find-by-subject-id-object-id');
const Get = require('./get');
const RemoveByHouseId = require('./remove-by-house-id');

module.exports = {
    create: Create,
    findBySubjectIdObjectId: FindBySubjectIdObjectId,
    get: Get,
    removeByHouseId: RemoveByHouseId
};
