'use strict';

const Expenditure = require('./schema/expenditure');

/**
* Creates an expenditure
*
* @param {Object} params - Expenditure object
* @returns {Promise<Object>} - returns created expenditure
*/
const create = async (params) => {

    const expenditure = await Expenditure.create(params);
    return expenditure.toJSON();
};

module.exports = create;
