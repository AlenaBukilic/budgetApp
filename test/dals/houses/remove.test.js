'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Houses = require('../../../lib/dals/entities/houses');
const Database = require('../../../lib/dals/db');
const Constants = require('../../../lib/constants');

const { budgets } = Constants.budgets;
const { currencies } = Constants.currencies;

exports.lab = Lab.script();

const {
    describe,
    it,
    before,
    after
} = exports.lab;

const { expect } = Code;

const userId = ObjectId();

describe('dals remove', () => {

    let house1, house2, house3;
    before(async () => {

        await Database.init();

        house1 = await Houses.create({
            name: 'My Household',
            budget: budgets.monthly,
            createdBy: userId,
            updatedBy: userId,
            currency: currencies.rsd
        });
        house2 = await Houses.create({
            name: 'My Household Two',
            budget: budgets.weekly,
            createdBy: userId,
            updatedBy: userId,
            currency: currencies.eur
        });
        house3 = await Houses.create({
            name: 'My Household Three',
            budget: budgets.weekly,
            createdBy: userId,
            updatedBy: userId,
            currency: currencies.eur
        });
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should remove houses by array of ids', async () => {

            const result = await Houses.remove([house1.id, house2.id]);

            expect(result.deletedCount).to.equal(2);
            expect(result.success).to.equal(true);
        });

        it('should remove a house by single id', async () => {

            const result = await Houses.remove(house3.id.toString());

            expect(result.deletedCount).to.equal(1);
            expect(result.success).to.equal(true);
        });

        it('should not remove a house if no matches', async () => {

            const result = await Houses.remove([ObjectId()]);

            expect(result.deletedCount).to.equal(0);
            expect(result.success).to.equal(true);
        });
    });
});
