'use strict';

const Category = require('./schema/category');

/**
* Deletes categories by houseId
*
* @param {Object} params
* @param {String|ObjectId} params.houseId  - House id
* @returns {Promise<Object>} returns deletedCount
*/
const removeByHouseId = async (params) => {

    const { houseId } = params;
    const { deletedCount } = await Category.deleteMany({ houseId });
    return { success: true, deletedCount };
};

module.exports = removeByHouseId;
