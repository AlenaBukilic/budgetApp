'use strict';

const House = require('./schema/house');

/**
* Deletes houses by ids
*
* @param {String|String[]|ObjectId|ObjectId[]} ids - House ids
* @returns {Promise<Object>} returns deletedCount
*/
const remove = async (ids) => {

    const queryParams = Array.isArray(ids) ? ids : [ids]
    const { deletedCount } = await House.deleteMany({ _id: { $in: queryParams } });
    return { success: true, deletedCount };
};

module.exports = remove;
