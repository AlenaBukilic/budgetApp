'use strict';

const House = require('./schema/house');

/**
* Gets houses by ids
*
* @param {String} ids - House's ids
* @returns {Promise<Array>} returns array of houses
*/
const getByIds = async (ids) => {

    const queryParams = Array.isArray(ids) ? ids : [ids]

    const houses = await House.find({ _id: { $in: queryParams } });
    if (houses && houses.length) {
        return houses.map(house => house.toJSON());
    }
    return houses;
};

module.exports = getByIds;
