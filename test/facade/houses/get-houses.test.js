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

describe('facade getHouses', () => {

    let user1, user2, house1;
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
        user2 = await Dals.entities.users.create({
            data: {
                email: 'user@mail.com',
                profile: {
                    firstName: 'user',
                    lastName: 'one'
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

        it('should throw on userId not provided', async () => {

            try {
                await Facade.entities.houses.getHouses({});
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('userId must be provided.');
        });

        it('should throw not found on non existing user', async () => {

            params = {
                userId
            };

            try {
                await Facade.entities.houses.getHouses(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).equal(404);
            expect(error.output.payload.message).equal('User not found.');
        });

        it('should return empty array on no matches', async () => {

            const houses = await Facade.entities.houses.getHouses({ userId: user2.id });

            expect(houses.length).to.equal(0);
        });
    });

    describe('succeeds', () => {

        let params, houses;

        before(async () => {

            params = {
                userId: user1.id.toString()
            };
            houses = await Facade.entities.houses.getHouses(params);
        });

        it('should find a house', async () => {

            expect(houses.length).to.equal(1);
            const house = houses[0];
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
