'use strict';

const Permission = require('./schema/permission');

/**
* Creates a permission
*
* @param {Object} params - Permission object
* @returns {Promise<Object>} - returns created permission
*/
const create = async (params) => {

    const permission = await Permission.create(params);
    if (Array.isArray(permission)) {
        return permission.map(permission => permission.toJSON());
    }
    return permission.toJSON();
};

module.exports = create;
