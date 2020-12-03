'use strict';

const Boom = require('@hapi/boom');
const Assert = require('assert');
const User = require('./schema/user');

/**
* Finds single user by email
*
* @param {Object} params.email - User's email
* @param {Object} params.emailCanonical - User's emailCanonical
* @returns {Promise<Object>} returns user object
*/
const findByEmail = async (params) => {

    const { email, emailCanonical } = params;

    Assert(email || emailCanonical, 'Either email or emailCanonical must be provided.');

    const queryParmas = {
        ...(email && { email }),
        ...(emailCanonical && { emailCanonical })
    };

    const user = await User.findOne(queryParmas);
    if (!user) {
        throw Boom.notFound('User not found.');
    }
    return user.toJSON();
};

module.exports = findByEmail;
