'use strict';

const Permission = require('./schema/permission');

/**
* Deletes permissions by houseId
*
* @param {Object} params
* @param {String|ObjectId} params.houseId  - House id
* @returns {Promise<Object>} returns deletedCount
*/
const removeByHouseId = async (params) => {

    const { houseId } = params;
    const { deletedCount } = await Permission.deleteMany({ objectId: houseId });
    return { success: true, deletedCount };
};

module.exports = removeByHouseId;
