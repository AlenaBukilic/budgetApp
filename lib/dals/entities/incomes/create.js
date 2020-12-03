'use strict';

const Income = require('./schema/income');

/**
* Creates an income
*
* @param {Object} params - Income object
* @returns {Promise<Object>} - returns created income
*/
const create = async (params) => {

    const income = await Income.create(params);
    return income.toJSON();
};

module.exports = create;
