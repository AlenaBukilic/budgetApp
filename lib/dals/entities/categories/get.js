'use strict';

const Assert = require('assert');
const Category = require('./schema/category');

/**
* Get categories
*
* @param {Object} params
* @param {String} params.group - income or expenditure
* @param {String|ObjectId} params.houseId
* @param {String|ObjectId} params.userId
* @returns {Promise<Object>} - returns categories
*/
const get = async (params) => {

    const {
        group,
        userId,
        houseId
    } = params;

    Assert(group, 'Group must be provided.');

    const queryParams = {
        group,
        ...houseId && { houseId },
        ...userId && { userId }
    }
    const categories = await Category.find(queryParams);
    if (categories.length) {
        return categories.map(category => category.toJSON());
    }
    return categories;
};

module.exports = get;
