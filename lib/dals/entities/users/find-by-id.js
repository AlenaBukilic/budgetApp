'use strict';

const Boom = require('@hapi/boom');
const User = require('./schema/user');

/**
* Finds single user by id
*
* @param {String} id - User's id
* @returns {Promise<Object>} returns user object
*/
const findById = async (id) => {

    const user = await User.findById({ _id: id });
    if (!user) {
        throw Boom.notFound('User not found.');
    }
    return user.toJSON();
};

module.exports = findById;
