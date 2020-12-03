'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Categories = require('../../../lib/dals/entities/categories');
const Database = require('../../../lib/dals/db');
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

describe('dals get', () => {

    before(async () => {

        await Database.init();

        await Categories.create({
            name: 'Salary',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.household,
            houseId
        });
        await Categories.create({
            name: 'Salary Two',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.household,
            houseId
        });
        await Categories.create({
            name: 'Food',
            createdBy: userId,
            updatedBy: userId,
            group: groups.expenditure,
            class: classes.household,
            houseId
        });
        await Categories.create({
            name: 'Salary',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.personal,
            userId
        });
        await Categories.create({
            name: 'Beer',
            createdBy: userId,
            updatedBy: userId,
            group: groups.expenditure,
            class: classes.personal,
            userId
        });
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('fails', () => {

        let error;
        it('throws if group not provided', async () => {

            try {
                await Categories.get({ houseId });
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.code).to.equals('ERR_ASSERTION');
            expect(error.message).equal('Group must be provided.');
        });
    });

    describe('succeeds', () => {

        it('should return categories for household by group', async () => {

            const params = {
                group: groups.income,
                houseId: houseId.toString()
            }
            const result = await Categories.get(params);

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
            const result = await Categories.get(params);

            expect(result.length).to.equal(1);
            const category = result[0];
            expect(category.id).to.exist();
            expect(category.type).to.equal(entities.category);
            expect(category.group).to.equal(params.group);
            expect(category.class).to.equal(classes.personal);
            expect(category.userId).to.equal(userId);
            expect(category.houseId).to.equal(null);
        });
    });
});
