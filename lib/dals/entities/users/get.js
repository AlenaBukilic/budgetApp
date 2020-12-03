'use strict';

const Assert = require('assert');
const User = require('./schema/user');

/**
* Gets all users
*
* @param {Object} params.isConfirmed - all users that are confirmed
* @param {Object} params.isBanned - all users that are banned
* @returns {Promise<Object>} returns either all users / or filtered by banned/confirmed
*/
const get = async (params) => {

    const {
        isConfirmed = false,
        isBanned = false
    } = params;

    if (isConfirmed && isBanned) {
        Assert.fail('Only isConfirmed or isBanned can be provided.');
    }

    const queryParmas = {
        ...Reflect.has(params, 'isConfirmed') && { isConfirmed },
        ...Reflect.has(params, 'isBanned') && { isBanned }
    };

    const users = await User.find(queryParmas);
    if (users && users.length) {
        return users.map(user => user.toJSON());
    }
    return users;
};

module.exports = get;
