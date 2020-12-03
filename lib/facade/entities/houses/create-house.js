'use strict';

const Assert = require('assert');

const Dals = require('../../../dals');
const Constants = require('../../../constants');

const { entities } = Constants.entities;
const { permissions } = Constants.permissions;

/**
* Creates a house
*
* @param {Object} params - House object
* @param {String} params.name - House name
* @param {String} params.budget - House budget
* @param {String} params.currency - House currency
* @param {String} params.userId - Id of the user making a request
* @returns {Promise<Object>} returns created house
*/
const createHouse = async (params) => {

    const {
        name,
        budget,
        currency,
        userId
    } = params;

    Assert(name, 'House name must be provided.');
    Assert(budget && currency, 'Budget and currency name must be provided.');
    Assert(userId, 'userId must be provided.');

    const user = await Dals.entities.users.findById(userId);

    const createParams = {
        name,
        budget,
        currency,
        createdBy: user.id,
        updatedBy: user.id
    };
    const house = await Dals.entities.houses.create(createParams);

    const createPrivParams = {
        subjectId: user.id,
        subjectType: entities.user,
        objectId: house.id,
        objectType: entities.house,
        permission: permissions.admin,
        createdBy: user.id,
        updatedBy: user.id,
    }
    await Dals.entities.permissions.create(createPrivParams);

    return house;
};

module.exports = createHouse;
