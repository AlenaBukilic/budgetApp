'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Houses = require('../../../lib/dals/entities/houses');
const Database = require('../../../lib/dals/db');
const Constants = require('../../../lib/constants');

const { entities } = Constants.entities;
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
const houseId = ObjectId();

describe('dals getByIds', () => {

    let house1, house2;
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
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should find houses by array of ids', async () => {

            const ids = [house1.id, house2.id, houseId];

            const houses = await Houses.getByIds(ids);

            expect(houses.length).to.equal(2);
            const houseMatched = [houses[0].id, houses[1].id];
            expect(houseMatched).to.include(house1.id);
            expect(houseMatched).to.include(house2.id);
            expect(houses[0].id).to.exist();
            expect(houses[0].type).to.equal(entities.house);
            expect(houses[1].id).to.exist();
            expect(houses[1].type).to.equal(entities.house);
        });

        it('should find houses by id', async () => {

            const ids = house1.id;

            const houses = await Houses.getByIds(ids);

            expect(houses.length).to.equal(1);
            expect(houses[0].id).to.equal(house1.id);
            expect(houses[0].type).to.equal(entities.house);
        });

        it('should return emty array on no matches', async () => {

            const ids = [houseId];

            const houses = await Houses.getByIds(ids);

            expect(houses.length).to.equal(0);
        });
    });
});
