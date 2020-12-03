'use strict';

const Assert = require('assert');
const Dals = require('../../../dals');

/**
* Gets categories
*
* @param {Object} params
* @param {String} params.userId - Id of the user making a request
* @param {String} [params.houseId] - house id if categroy belongs to household
* @param {String} params.group - income or expenditure
* @returns {Promise<Object>} returns array of categories
*/
const getCategories = async (params) => {

    const {
        userId,
        group,
        houseId
    } = params;

    Assert(userId, 'userId must be provided.');
    Assert(group, 'Group must be provided.');

    return Dals.entities.categories.get({
        group,
        ...houseId && { houseId },
        ...!houseId && { userId }
    });
};

module.exports = getCategories;
