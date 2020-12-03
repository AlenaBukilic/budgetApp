'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Houses = require('../../../lib/dals/entities/houses');
const Database = require('../../../lib/dals/db');
const Constants = require('../../../lib/constants');

const { budgets } = Constants.budgets;
const { entities } = Constants.entities;
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

describe('create', () => {

    before(async () => {

        await Database.init();
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        let params;

        it('should create a house', async () => {

            params = {
                name: 'My Household',
                budget: budgets.monthly,
                createdBy: userId,
                updatedBy: userId,
                currency: currencies.rsd
            };

            const house = await Houses.create(params);

            expect(house.id).to.exist();
            expect(house.type).to.equal(entities.house);
            expect(house.name).to.equal(params.name);
            expect(house.nameCanonical).to.equal(params.name.toLowerCase());
            expect(house.budget).to.equal(params.budget);
            expect(house.createdBy).to.equal(userId);
            expect(house.updatedBy).to.equal(userId);
            expect(house.currency).to.equal(params.currency);
            expect(house.createdAt).to.exist();
            expect(house.updatedAt).to.exist();
        });
    });

    describe('fails', () => {

        let params, error;

        it('should throw on name not provided', async () => {

            params = {
                budget: budgets.monthly,
                createdBy: userId,
                updatedBy: userId
            };

            try {
                await Houses.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.code).to.equals('ERR_ASSERTION');
            expect(error.message).equal('House name must be provided.');
        });

        it('should throw on unsupported budget type', async () => {

            params = {
                name: 'My Household',
                budget: 'text',
                createdBy: userId,
                updatedBy: userId,
                currency: currencies.rsd
            };

            try {
                await Houses.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('House validation failed: budget: `text` is not a valid enum value for path `budget`.');
        });

        it('should throw on unsupported currency type', async () => {

            params = {
                name: 'My Household',
                budget: budgets.weekly,
                createdBy: userId,
                updatedBy: userId,
                currency: 'cad'
            };

            try {
                await Houses.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('House validation failed: currency: `cad` is not a valid enum value for path `currency`.');
        });
    });
});
