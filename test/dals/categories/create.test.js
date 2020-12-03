'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Categories = require('../../../lib/dals/entities/categories');
const Database = require('../../../lib/dals/db');
const Constants = require('../../../lib/constants');

const { entities } = Constants.entities;
const { groups } = Constants.groups;
const { classes } = Constants.classes;


exports.lab = Lab.script();
const {
    describe,
    it,
    before,
    after
} = exports.lab;
const { expect } = Code;

const userId = ObjectId();
const houseId = ObjectId();

describe('dals create', () => {

    before(async () => {

        await Database.init();
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        let params;

        it('should create a category in pesonal', async () => {

            params = {
                name: 'Salary',
                createdBy: userId,
                updatedBy: userId,
                group: groups.income,
                class: classes.personal,
                userId
            };

            const category = await Categories.create(params);

            expect(category.id).to.exist();
            expect(category.type).to.equal(entities.category);
            expect(category.name).to.equal(params.name);
            expect(category.nameCanonical).to.equal(params.name.toLowerCase());
            expect(category.group).to.equal(params.group);
            expect(category.class).to.equal(params.class);
            expect(category.userId).to.equal(params.userId);
            expect(category.houseId).to.equal(null);
            expect(category.createdBy).to.equal(userId);
            expect(category.updatedBy).to.equal(userId);
            expect(category.createdAt).to.exist();
            expect(category.updatedAt).to.exist();
        });

        it('should create a category in household', async () => {

            params = {
                name: 'Salary',
                createdBy: userId,
                updatedBy: userId,
                group: groups.income,
                class: classes.household,
                houseId
            };

            const category = await Categories.create(params);

            expect(category.id).to.exist();
            expect(category.type).to.equal(entities.category);
            expect(category.name).to.equal(params.name);
            expect(category.nameCanonical).to.equal(params.name.toLowerCase());
            expect(category.group).to.equal(params.group);
            expect(category.class).to.equal(params.class);
            expect(category.userId).to.equal(null);
            expect(category.houseId).to.equal(params.houseId);
            expect(category.createdBy).to.equal(userId);
            expect(category.updatedBy).to.equal(userId);
            expect(category.createdAt).to.exist();
            expect(category.updatedAt).to.exist();
        });
    });

    describe('fails', () => {

        let params, error;

        it('should throw on name not provided', async () => {

            params = {
                createdBy: userId,
                updatedBy: userId,
                group: groups.income,
                class: classes.household,
                houseId
            };

            try {
                await Categories.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.code).to.equals('ERR_ASSERTION');
            expect(error.message).equal('Category name must be provided.');
        });


        it('should throw on unsupported class type', async () => {

            params = {
                name: 'Salary',
                createdBy: userId,
                updatedBy: userId,
                group: groups.income,
                class: 'text',
                houseId
            };

            try {
                await Categories.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Category validation failed: class: `text` is not a valid enum value for path `class`.');
        });

        it('should throw on unsupported groupe type', async () => {

            params = {
                name: 'Salary',
                createdBy: userId,
                updatedBy: userId,
                group: 'blah',
                class: classes.household,
                houseId
            };

            try {
                await Categories.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Category validation failed: group: `blah` is not a valid enum value for path `group`.');
        });
    });
});
