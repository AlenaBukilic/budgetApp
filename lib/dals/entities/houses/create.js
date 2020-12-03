'use strict';

const Assert = require('assert');
const House = require('./schema/house');

/**
* Creates a house
*
* @param {Object} params - House object
* @returns {Promise<Object>} returns created house
*/
const create = async (params) => {

    Assert(params.name, 'House name must be provided.');

    const createParams = {
        ...params,
        nameCanonical: params.name.toLowerCase()
    };

    const house = await House.create(createParams);
    return house.toJSON();
};

module.exports = create;
