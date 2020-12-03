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

const userId = ObjectId().toString();
const houseId = ObjectId().toString();

describe('facade findHouse', () => {

    let user1, house1, house2;
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
        house1 = await Dals.entities.houses.create({
            name: 'My Household',
            budget: budgets.monthly,
            createdBy: user1.id,
            updatedBy: user1.id,
            currency: currencies.rsd
        });
        house2 = await Dals.entities.houses.create({
            name: 'My Household Two',
            budget: budgets.annual,
            createdBy: userId,
            updatedBy: userId,
            currency: currencies.usd
        });
        await Dals.entities.permissions.create({
            subjectId: user1.id,
            subjectType: entities.user,
            objectId: house1.id,
            objectType: entities.house,
            createdBy: user1.id,
            updatedBy: user1.id,
            permission: permissions.admin
        })
    });

    after(async() => {

        await Dals.database.dropDatabase();
    });

    describe('fails', () => {

        let params, error;

        it('should throw on houseId not provided', async () => {

            params = {
                userId
            };

            try {
                await Facade.entities.houses.findHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('houseId must be provided.');
        });

        it('should throw on userId not provided', async () => {

            params = {
                houseId
            };

            try {
                await Facade.entities.houses.findHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('userId must be provided.');
        });

        it('should throw forbidden on non existing user', async () => {

            params = {
                userId,
                houseId: house1.id.toString()
            };

            try {
                await Facade.entities.houses.findHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).equal(403);
            expect(error.output.payload.message).equal('User does not have the permission to perform this action.');
        });

        it('should throw forbidden on non existing house', async () => {

            params = {
                userId: user1.id.toString(),
                houseId
            };

            try {
                await Facade.entities.houses.findHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).equal(403);
            expect(error.output.payload.message).equal('User does not have the permission to perform this action.');
        });

        it('should throw forbidden on non existing permission', async () => {

            params = {
                userId: user1.id.toString(),
                houseId: house2.id.toString()
            };

            try {
                await Facade.entities.houses.findHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).equal(403);
            expect(error.output.payload.message).equal('User does not have the permission to perform this action.');
        });
    });

    describe('succeeds', () => {

        let params, house;

        before(async () => {

            params = {
                userId: user1.id.toString(),
                houseId: house1.id.toString()
            };
            house = await Facade.entities.houses.findHouse(params);
        });

        it('should find a house', async () => {

            expect(house.id).to.exist();
            expect(house.type).to.equal(entities.house);
            expect(house.name).to.equal(house1.name);
            expect(house.nameCanonical).to.equal(house1.name.toLowerCase());
            expect(house.budget).to.equal(house1.budget);
            expect(house.currency).to.equal(house1.currency);
            expect(house.createdBy).to.equal(user1.id);
            expect(house.updatedBy).to.equal(user1.id);
            expect(house.createdAt).to.exist();
            expect(house.updatedAt).to.exist();
        });
    });
});
