'use strict';

const Assert = require('assert');
const Category = require('./schema/category');

/**
* Creates a category
*
* @param {Object} params - Category object
* @returns {Promise<Object>} - returns created category
*/
const create = async (params) => {

    Assert(params.name, 'Category name must be provided.');

    const createParams = {
        ...params,
        nameCanonical: params.name.toLowerCase()
    };

    const category = await Category.create(createParams);
    return category.toJSON();
};

module.exports = create;
