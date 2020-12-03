'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Expenditures = require('../../../lib/dals/entities/expenditures');
const Database = require('../../../lib/dals/db');
const Constants = require('../../../lib/constants');

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
const categoryId = ObjectId();

describe('dals removeByHouseId', () => {

    before(async () => {

        await Database.init();

        await Expenditures.create({
            categoryId,
            createdBy: userId,
            updatedBy: userId,
            week: 1,
            year: 2020,
            objectId: houseId,
            objectType: entities.house
        });
        await Expenditures.create({
            categoryId,
            createdBy: userId,
            updatedBy: userId,
            week: 2,
            year: 2020,
            objectId: houseId,
            objectType: entities.house
        });
        await Expenditures.create({
            categoryId,
            createdBy: userId,
            updatedBy: userId,
            week: 1,
            year: 2020,
            objectId: userId,
            objectType: entities.user
        });

    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should remove expenditures by houseId', async () => {

            const result = await Expenditures.removeByHouseId({ houseId });

            expect(result.deletedCount).to.equal(2);
            expect(result.success).to.equal(true);
        });

        it('should not remove a house if no matches', async () => {

            const result = await Expenditures.removeByHouseId({ houseId: ObjectId() });

            expect(result.deletedCount).to.equal(0);
            expect(result.success).to.equal(true);
        });
    });
});
