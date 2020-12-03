'use strict';

const Assert = require('assert');

const Dals = require('../../../dals');
const Constants = require('../../../constants');

const { classes } = Constants.classes;

/**
* Creates a category
*
* @param {Object} params - category object
* @param {String} params.name - category name
* @param {String} params.group - category group
* @param {String} params.userId - Id of the user making a request
* @param {String} [params.houseId] - Id of the house if category for household
* @returns {Promise<Object>} returns created category
*/
const createCategory = async (params) => {

    const {
        name,
        group,
        userId,
        houseId
    } = params;

    Assert(name, 'Category name must be provided.');
    Assert(group, 'Group name must be provided.');
    Assert(userId, 'userId must be provided.');

    const user = await Dals.entities.users.findById(userId);

    const createParams = {
        name,
        nameCanonical: name.toLowerCase(),
        group,
        class: houseId ? classes.household : classes.personal,
        createdBy: user.id,
        updatedBy: user.id,
        ...houseId && { houseId },
        ...!houseId && { userId }
    };
    return Dals.entities.categories.create(createParams);
};

module.exports = createCategory;
