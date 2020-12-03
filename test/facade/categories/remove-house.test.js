'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { result } = require('lodash');
const { ObjectId } = require('mongoose').Types;
const Sinon = require('sinon');

const Constants = require('../../../lib/constants');
const Dals = require('../../../lib/dals');
const Facade = require('../../../lib/facade');

const { budgets } = Constants.budgets;
const { entities } = Constants.entities;
const { currencies } = Constants.currencies;
const { permissions } = Constants.permissions;
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

const sandbox = Sinon.createSandbox();

const userId = ObjectId().toString();
const houseId = ObjectId().toString();

describe('facade removeHouse', () => {

    let user1, user2, house1, house2, cat1;
    before(async () => {

        await Dals.database.init();
        user1 = await Dals.entities.users.create({
            data: {
                email: 'user@mail.com',
                profile: {
                    firstName: 'User',
                    lastName: 'Name'
                },
                createdBy: userId,
                updatedBy: userId,
                isConfirmed: true
            },
            password: 'password'
        });
        user2 = await Dals.entities.users.create({
            data: {
                email: 'user2@mail.com',
                profile: {
                    firstName: 'User2',
                    lastName: 'Name'
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
        });
        await Dals.entities.permissions.create({
            subjectId: user2.id,
            subjectType: entities.user,
            objectId: house1.id,
            objectType: entities.house,
            createdBy: userId,
            updatedBy: userId,
            permission: permissions.member
        });
        cat1 = await Dals.entities.categories.create({
            name: 'Salary',
            createdBy: userId,
            updatedBy: userId,
            group: groups.income,
            class: classes.personal,
            houseId: house1.id
        });
        await Dals.entities.incomes.create({
            categoryId: cat1.id,
            createdBy: userId,
            updatedBy: userId,
            week: 1,
            year: 2020,
            objectId: house1.id,
            objectType: entities.house
        });
        await Dals.entities.expenditures.create({
            categoryId: cat1.id,
            createdBy: userId,
            updatedBy: userId,
            week: 1,
            year: 2020,
            objectId: house1.id,
            objectType: entities.house
        });
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
                await Facade.entities.houses.removeHouse(params);
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
                await Facade.entities.houses.removeHouse(params);
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
                await Facade.entities.houses.removeHouse(params);
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
                await Facade.entities.houses.removeHouse(params);
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
                await Facade.entities.houses.removeHouse(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).equal(403);
            expect(error.output.payload.message).equal('User does not have the permission to perform this action.');
        });

        it('should throw forbidden on non admin permission', async () => {

            params = {
                userId: user2.id.toString(),
                houseId: house1.id.toString()
            };

            try {
                await Facade.entities.houses.removeHouse(params);
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

        let params;
        let result;
        let callParams;
        let incomesRemoveByHouseIdSpy;
        let expendituresRemoveByHouseIdSpy;
        let categoriesRemoveByHouseIdSpy;
        let housesRemoveSpy;
        let permissionsRemoveByHouseIdSpy;
        before(async () => {

            incomesRemoveByHouseIdSpy = sandbox.spy(Dals.entities.incomes, 'removeByHouseId');
            expendituresRemoveByHouseIdSpy = sandbox.spy(Dals.entities.expenditures, 'removeByHouseId');
            categoriesRemoveByHouseIdSpy = sandbox.spy(Dals.entities.categories, 'removeByHouseId');
            housesRemoveSpy = sandbox.spy(Dals.entities.houses, 'remove');
            permissionsRemoveByHouseIdSpy = sandbox.spy(Dals.entities.permissions, 'removeByHouseId');

            callParams = {
                houseId: house1.id
            };

            params = {
                userId: user1.id.toString(),
                houseId: house1.id.toString()
            };
            result = await Facade.entities.houses.removeHouse(params);
        });

        after(async() => {

            sandbox.restore();
        });

        it('should call remove incomes', async () => {

            expect(incomesRemoveByHouseIdSpy.callCount).to.equal(1);
            sandbox.assert.calledWithExactly(incomesRemoveByHouseIdSpy, callParams);
        });

        it('should call remove expenditures', async () => {

            expect(expendituresRemoveByHouseIdSpy.callCount).to.equal(1);
            sandbox.assert.calledWithExactly(expendituresRemoveByHouseIdSpy, callParams);
        });

        it('should call remove categories', async () => {

            expect(categoriesRemoveByHouseIdSpy.callCount).to.equal(1);
            sandbox.assert.calledWithExactly(categoriesRemoveByHouseIdSpy, callParams);
        });

        it('should call remove house', async () => {

            expect(housesRemoveSpy.callCount).to.equal(1);
            sandbox.assert.calledWithExactly(housesRemoveSpy, house1.id);
        });

        it('should call remove permissions', async () => {

            expect(permissionsRemoveByHouseIdSpy.callCount).to.equal(1);
            sandbox.assert.calledWithExactly(permissionsRemoveByHouseIdSpy, callParams);
        });

        it('should remove a house', async () => {

            expect(result).to.exist();
            expect(result).to.equal({ success: true, deletedCount: 1 });
        });
    });
});
