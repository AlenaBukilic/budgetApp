'use strict';

const CreateCategory = require('./create-category');
const FindCategory = require('./find-category');
const GetCategories = require('./get-categories');
const RemoveCategory = require('./remove-category');

module.exports = {
    createCategory: CreateCategory,
    findcategory: FindCategory,
    getCategories: GetCategories,
    removeCategory: RemoveCategory
};
