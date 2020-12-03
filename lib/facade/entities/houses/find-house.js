'use strict';

const Boom = require('@hapi/boom');
const Assert = require('assert');

const Dals = require('../../../dals');

/**
* Finds a house
*
* @param {Object} params
* @param {String} params.houseId - House id
* @param {String} params.userId - Id of the user making a request
* @returns {Promise<Object>} returns a house
*/
const findHouse = async (params) => {

    const {
        houseId,
        userId
    } = params;

    Assert(houseId, 'houseId must be provided.');
    Assert(userId, 'userId must be provided.');

    let house;
    try {

        const user = await Dals.entities.users.findById(userId);
        house = await Dals.entities.houses.findById(houseId);

        const findParams = {
            subjectId: user.id,
            objectId: house.id,
        }
        await Dals.entities.permissions.findBySubjectIdObjectId(findParams);
    }
    catch (err) {

        if (err.isBoom && err.output.statusCode === 404) {
            throw Boom.forbidden('User does not have the permission to perform this action.');
        }
        throw err;
    }
    return house;
};

module.exports = findHouse;
