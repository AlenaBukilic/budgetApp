'use strict';

const Boom = require('@hapi/boom');
const _ = require('lodash');
const Assert = require('assert');
const User = require('./schema/user');

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

    if (_.isString(data.email)) {
        data.emailCanonical = data.email.toLowerCase();
    }

    if (data.profile) {
        if (_.isString(data.profile.firstName)) {
            data.profile.firstNameCanonical = data.profile.firstName.toLowerCase();
        }
        if (_.isString(data.profile.lastName)) {
            data.profile.lastNameCanonical = data.profile.lastName.toLowerCase();
        }
    }
};

/**
* Updates single user by id
*
* @param {ObjectId} id - User's id
* @param {ObjectId} data - User's profile data
* @returns {Promise<Object>} returns user object
*/
const update = async (id, data) => {

    Assert(id, 'User id must be provided.');

    internals._setCanonicalProperties(data);

    const flattenedProfile = _.mapKeys(data.profile, (value, key) => `profile.${key}`);
    const $set = {
        ..._.omit(data, 'profile'),
        ...flattenedProfile
    };

    const user = await User.findOneAndUpdate({ _id: id }, { $set }, { new: true });
    if (!user) {
        throw Boom.notFound('User not found.');
    }
    return user.toJSON();
};

module.exports = update;
