'use strict';

const _ = require('lodash');
const User = require('./schema/user');
const PasswordHash = require('password-hash');

const internals = {};

/**
 * Sets canonical props from present given props
 *
 * @param {String} data.email - The user's email
 * @param {Object} data.profile
 * @param {String} data.profile.firstName - The user's first name
 * @param {String} data.profile.lastName - The user's last name
 * @private
 */
internals._setCanonicalProperties = (data) => {

    const dataWithCanonical = { ...data };

    if (_.isString(data.email)) {
        dataWithCanonical.emailCanonical = dataWithCanonical.email.toLowerCase();
    }

    if (data.profile) {
        if (_.isString(data.profile.firstName)) {
            dataWithCanonical.profile.firstNameCanonical = dataWithCanonical.profile.firstName.toLowerCase();
        }
        if (_.isString(data.profile.lastName)) {
            dataWithCanonical.profile.lastNameCanonical = dataWithCanonical.profile.lastName.toLowerCase();
        }
    }
    return dataWithCanonical;
};

/**
* Creates a user
*
* @param {Object} params.data - User object
* @param {String} params.password - User's password
* @returns {Promise<Object>} returns created user
*/
const create = async (params) => {

    const { data, password } = params;

    const dataWithCanonical = internals._setCanonicalProperties(data);

    const passwordHash = PasswordHash.generate(password);

    const createParams = {
        ...dataWithCanonical,
        passwordHash,
    };

    const user = await User.create(createParams);
    return user.toJSON();
};

module.exports = create;
