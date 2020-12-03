'use strict';

const Boom = require('@hapi/boom');
const Permission = require('./schema/permission');

/**
* Find permission by subjectId objectId pair
*
* @param {Object} params - Query params
* @param {String | ObjectId} params.subjectId - subject id
* @param {String | ObjectId} params.objectId - object id
* @returns {Promise<Object>} - returns permission
*/
const findBySubjectIdObjectId = async (params) => {

    const {
        subjectId,
        objectId
    } = params;

    const queryParams = {
        subjectId,
        objectId
    };
    const permission = await Permission.findOne(queryParams);

    if (!permission) {
        throw Boom.notFound('Permission not found.');
    }
    return permission.toJSON();
};

module.exports = findBySubjectIdObjectId;
