'use strict';

const Assert = require('assert');
const Dals = require('../../../dals');

/**
* Gets houses for a user
*
* @param {Object} params
* @param {String} params.userId - Id of the user making a request
* @returns {Promise<Object>} returns array of houses
*/
const getHouses = async (params) => {

    const {
        userId
    } = params;

    Assert(userId, 'userId must be provided.');

    const user = await Dals.entities.users.findById(userId);

    const permissions = await Dals.entities.permissions.get({ subjectId: user.id });
    if (permissions && permissions.length) {

        const houseIds = permissions.map(permission => permission.objectId);
        return Dals.entities.houses.getByIds(houseIds);
    }
    return [];
};

module.exports = getHouses;
