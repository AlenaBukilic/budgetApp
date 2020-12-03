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

describe('dals findById', () => {

    let house1;
    before(async () => {

        await Database.init();

        house1 = await Houses.create({
            name: 'My Household',
            budget: budgets.monthly,
            createdBy: userId,
            updatedBy: userId,
            currency: currencies.rsd
        });
        await Houses.create({
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

        it('should find house by id', async () => {

            const house = await Houses.findById(house1.id.toString());

            expect(house.name).to.equal(house1.name);
            expect(house.id).to.equal(house1.id);
            expect(house.type).to.equal(entities.house);
        });
    });

    describe('failes', () => {

        let error;

        it('throws not found error for non existing house', async () => {

            try{
                await Houses.findById(ObjectId().toString());
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).to.be.equal(404);
            expect(error.message).to.be.equal('House not found.');
        });
    });
});
