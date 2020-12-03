'use strict';

const Boom = require('@hapi/boom');
const House = require('./schema/house');

/**
* Finds single house by id
*
* @param {String} id - House's id
* @returns {Promise<Object>} returns house object
*/
const findById = async (id) => {

    const house = await House.findById({ _id: id });
    if (!house) {
        throw Boom.notFound('House not found.');
    }
    return house.toJSON();
};

module.exports = findById;
