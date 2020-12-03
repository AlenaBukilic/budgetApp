'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Dals = require('../../../lib/dals');
const Facade = require('../../../lib/facade');
const Constants = require('../../../lib/constants');

const { groups } = Constants.groups;
const { classes } = Constants.classes;
const { entities } = Constants.entities;

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

describe('facade getCategories', () => {

    before(async () => {

        await Dals.database.init();

        await Dals.entities.categories.create({
            name: 'Salary',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.household,
            houseId
        });
        await Dals.entities.categories.create({
            name: 'Salary Two',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.household,
            houseId
        });
        await Dals.entities.categories.create({
            name: 'Food',
            createdBy: userId,
            updatedBy: userId,
            group: groups.expenditure,
            class: classes.household,
            houseId
        });
        await Dals.entities.categories.create({
            name: 'Salary',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.personal,
            userId
        });
        await Dals.entities.categories.create({
            name: 'Beer',
            createdBy: userId,
            updatedBy: userId,
            group: groups.expenditure,
            class: classes.personal,
            userId
        });
    });

    after(async() => {

        await Dals.database.dropDatabase();
    });

    describe('fails', () => {

        let error;
        it('throws if group not provided', async () => {

            try {
                await Facade.entities.categories.getCategories({ userId });
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Group must be provided.');
        });
        it('throws if userId not provided', async () => {

            try {
                await Facade.entities.categories.getCategories({ group: groups.income });
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('userId must be provided.');
        });
    });

    describe('succeeds', () => {

        it('should return categories for household by group', async () => {

            const params = {
                group: groups.income,
                houseId: houseId.toString(),
                userId: userId.toString()
            }
            const result = await Facade.entities.categories.getCategories(params);

            expect(result.length).to.equal(2);
            result.forEach((category) => {
                expect(category.id).to.exist();
                expect(category.type).to.equal(entities.category);
                expect(category.group).to.equal(params.group);
                expect(category.class).to.equal(classes.household);
                expect(category.userId).to.equal(null);
                expect(category.houseId).to.equal(houseId);
            });
        });

        it('should return categories for personal by group', async () => {

            const params = {
                group: groups.expenditure,
                userId: userId.toString()
            }
            const result = await Facade.entities.categories.getCategories(params);

            expect(result.length).to.equal(1);
            const category = result[0];
            expect(category.id).to.exist();
            expect(category.type).to.equal(entities.category);
            expect(category.group).to.equal(params.group);
            expect(category.class).to.equal(classes.personal);
            expect(category.userId).to.equal(userId);
            expect(category.houseId).to.equal(null);
        });

        it('should return empty on no matches', async () => {

            const params = {
                group: groups.expenditure,
                userId: ObjectId().toString()
            }
            const result = await Facade.entities.categories.getCategories(params);

            expect(result.length).to.equal(0);
        });
    });
});
