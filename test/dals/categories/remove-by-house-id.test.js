'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Categories = require('../../../lib/dals/entities/categories');
const Database = require('../../../lib/dals/db');
const Constants = require('../../../lib/constants');

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

describe('dals removeByHouseId', () => {

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
            name: 'Salary',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.personal,
            userId
        });

    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should remove categories by houseId', async () => {

            const result = await Categories.removeByHouseId({ houseId });

            expect(result.deletedCount).to.equal(2);
            expect(result.success).to.equal(true);
        });

        it('should not remove a house if no matches', async () => {

            const result = await Categories.removeByHouseId({ houseId: ObjectId() });

            expect(result.deletedCount).to.equal(0);
            expect(result.success).to.equal(true);
        });
    });
});
