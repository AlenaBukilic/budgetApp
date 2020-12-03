'use strict';

const Boom = require('@hapi/boom');
const Assert = require('assert');
const Dals = require('../../../dals');
const Constants = require('../../../constants');

const { admin } = Constants.permissions.permissions;


/**
* Removes a house and all data related to it
*
* @param {Object} params
* @param {String} params.userId - Id of the user making a request
* @param {String} params.houseId - id of house to remove
* @returns {Promise<Object>} returns deleted count
*/
const removeHouse = async (params) => {

    const {
        userId,
        houseId
    } = params;

    Assert(userId, 'userId must be provided.');
    Assert(houseId, 'houseId must be provided.');

    let house;
    try {

        const user = await Dals.entities.users.findById(userId);
        house = await Dals.entities.houses.findById(houseId);

        const findParams = {
            subjectId: user.id,
            objectId: house.id,
        }
        const permission = await Dals.entities.permissions.findBySubjectIdObjectId(findParams);

        if (permission && (permission.permission !== admin)) {
            throw Boom.notFound('No admin permission.');
        }
    }
    catch (err) {

        if (err.isBoom && err.output.statusCode === 404) {
            throw Boom.forbidden('User does not have the permission to perform this action.');
        }
        throw err;
    }

    await Dals.entities.incomes.removeByHouseId({ houseId: house.id });

    await Dals.entities.expenditures.removeByHouseId({ houseId: house.id });

    await Dals.entities.categories.removeByHouseId({ houseId: house.id });

    const result = await Dals.entities.houses.remove(house.id);

    await Dals.entities.permissions.removeByHouseId({ houseId: house.id });

    return result;
};

module.exports = removeHouse;
