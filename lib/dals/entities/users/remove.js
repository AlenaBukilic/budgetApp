'use strict';

const Assert = require('assert');
const { ObjectId } = require('mongodb');
const User = require('./schema/user');

/**
* Deletes a user
*
* @param {Object} id - User id
* @returns {Promise<Object>} - returns deleteCount
*/
const remove = async (id) => {

    Assert(id, 'User id must be provided.');

    const { deletedCount } = await User.deleteOne({ _id: ObjectId(id) });

    return { deletedCount };
};

module.exports = remove;
