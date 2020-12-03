'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Constants = require('../../../lib/constants');
const Dals = require('../../../lib/dals');
const Facade = require('../../../lib/facade');

const { budgets } = Constants.budgets;
const { entities } = Constants.entities;
const { currencies } = Constants.currencies;
const { permissions } = Constants.permissions;

exports.lab = Lab.script();
const {
    describe,
    it,
    before,
    after
} = exports.lab;
const { expect } = Code;

const userId = ObjectId();

describe('facade createHouse', () => {

    let user1;
    before(async () => {

        await Dals.database.init();
        user1 = await Dals.entities.users.create({
            data: {
                email: 'AlenA@mail.com',
                profile: {
                    firstName: 'Alena',
                    lastName: 'Haha'
                },
                createdBy: userId,
                updatedBy: userId,
                isConfirmed: true
            },
            password: 'password'
        });
    });

    after(async() => {

        await Dals.database.dropDatabase();
    });

    describe('fails', () => {

        let params, error;

        it('should throw on name not provided', async () => {

            params = {
                budget: budgets.monthly,
                currency: currencies.usd,
                userId: userId.toString()
            };

            try {
                await Facade.entities.houses.createHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('House name must be provided.');
        });

        it('should throw on budget not provided', async () => {

            params = {
                name: 'xxx',
                currency: currencies.usd,
                userId: userId.toString()
            };

            try {
                await Facade.entities.houses.createHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Budget and currency name must be provided.');
        });

        it('should throw on currency not provided', async () => {

            params = {
                name: 'xxx',
                budget: budgets.monthly,
                userId: userId.toString()
            };

            try {
                await Facade.entities.houses.createHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Budget and currency name must be provided.');
        });

        it('should throw on userId not provided', async () => {

            params = {
                name: 'xxx',
                budget: budgets.monthly,
                currency: currencies.usd
            };

            try {
                await Facade.entities.houses.createHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('userId must be provided.');
        });

        it('should throw on non existing userId', async () => {

            params = {
                name: 'xxx',
                budget: budgets.monthly,
                currency: currencies.usd,
                userId
            };

            try {
                await Facade.entities.houses.createHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).equal(404);
            expect(error.output.payload.message).equal('User not found.');
        });
    });

    describe('succeeds', () => {

        let params, house;

        before(async () => {

            params = {
                name: 'My Household',
                budget: budgets.monthly,
                currency: currencies.rsd,
                userId: user1.id.toString()
            };
            house = await Facade.entities.houses.createHouse(params);
        });

        it('should create a house', async () => {

            expect(house.id).to.exist();
            expect(house.type).to.equal(entities.house);
            expect(house.name).to.equal(params.name);
            expect(house.nameCanonical).to.equal(params.name.toLowerCase());
            expect(house.budget).to.equal(params.budget);
            expect(house.currency).to.equal(params.currency);
            expect(house.createdBy).to.equal(user1.id);
            expect(house.updatedBy).to.equal(user1.id);
            expect(house.createdAt).to.exist();
            expect(house.updatedAt).to.exist();
        });

        it('should create a admin permission for user', async () => {

            const params = {
                subjectId: user1.id,
                objectId: house.id
            }
            const permission = await Dals.entities.permissions.findBySubjectIdObjectId(params);

            expect(permission).to.exist();
            expect(permission.permission).to.equal(permissions.admin);
            expect(permission.subjectId).to.equal(user1.id);
            expect(permission.subjectType).to.equal(entities.user);
            expect(permission.objectId).to.equal(house.id);
            expect(permission.objectType).to.equal(entities.house);
            expect(permission.createdBy).to.equal(user1.id);
            expect(permission.updatedBy).to.equal(user1.id);
        });
    });
});
