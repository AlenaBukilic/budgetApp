'use strict';

const Expenditure = require('./schema/expenditure');

/**
* Deletes expenditure by houseId
*
* @param {Object} params
* @param {String|ObjectId} params.houseId  - House id
* @returns {Promise<Object>} returns deletedCount
*/
const removeByHouseId = async (params) => {

    const { houseId } = params;
    const { deletedCount } = await Expenditure.deleteMany({ objectId: houseId });
    return { success: true, deletedCount };
};

module.exports = removeByHouseId;
