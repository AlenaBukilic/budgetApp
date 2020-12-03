'use strict';

/**
* Helper to decorate entites with type and id
*
* @param {Object} data - House object
* @param {String} type - Type of the entity
* @returns {Promise<Object>} returns normalized data
*/
const normalizeData = (data, type) => {

    const decorated = {
        ...data,
        id: data._id,
        type
    };
    delete decorated._id;
    return decorated;
};

module.exports = normalizeData;
