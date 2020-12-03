'use strict';

const Permission = require('./schema/permission');

/**
* Gets permissions by subjectId or objectId
*
* @param {Object} params - Query params
* @param {String | ObjectId} [params.subjectId] - subject id
* @param {String | ObjectId} [params.objectId] - object id
* @returns {Promise<Object>} - returns array of permission
*/
const get = async (params) => {

    const {
        subjectId,
        objectId
    } = params;

    const queryParams = {
        ...subjectId && { subjectId },
        ...objectId && { objectId }
    };
    const permissions = await Permission.find(queryParams);

    if (permissions && permissions.length) {
        return permissions.map(permission => permission.toJSON());
    }
    return permissions;
};

module.exports = get;
