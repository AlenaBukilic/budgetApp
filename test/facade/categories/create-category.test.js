'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Constants = require('../../../lib/constants');
const Dals = require('../../../lib/dals');
const Facade = require('../../../lib/facade');

const { entities } = Constants.entities;
const { classes } = Constants.classes;
const { groups } = Constants.groups;


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

describe('facade createCategory', () => {

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
                group: groups.income,
                userId: userId.toString()
            };

            try {
                await Facade.entities.categories.createCategory(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Category name must be provided.');
        });

        it('should throw on group not provided', async () => {

            params = {
                name: 'xxx',
                userId: userId.toString()
            };

            try {
                await Facade.entities.categories.createCategory(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Group name must be provided.');
        });

        it('should throw on userId not provided', async () => {

            params = {
                name: 'xxx',
                group: groups.income
            };

            try {
                await Facade.entities.categories.createCategory(params);
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
                group: groups.income,
                userId
            };

            try {
                await Facade.entities.categories.createCategory(params);
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

        let params, category;

        it('should create a category with class personal', async () => {

            params = {
                name: 'Salary',
                group: groups.income,
                userId: user1.id.toString()
            };
            category = await Facade.entities.categories.createCategory(params);

            expect(category.id).to.exist();
            expect(category.type).to.equal(entities.category);
            expect(category.name).to.equal(params.name);
            expect(category.nameCanonical).to.equal(params.name.toLowerCase());
            expect(category.group).to.equal(params.group);
            expect(category.class).to.equal(classes.personal);
            expect(category.houseId).to.equal(null);
            expect(category.userId).to.equal(user1.id);
            expect(category.createdBy).to.equal(user1.id);
            expect(category.updatedBy).to.equal(user1.id);
            expect(category.createdAt).to.exist();
            expect(category.updatedAt).to.exist();
        });

        it('should create a category with class household', async () => {

            params = {
                name: 'Food',
                group: groups.expenditure,
                userId: user1.id.toString(),
                houseId: houseId.toString()
            };
            category = await Facade.entities.categories.createCategory(params);

            expect(category.id).to.exist();
            expect(category.type).to.equal(entities.category);
            expect(category.name).to.equal(params.name);
            expect(category.nameCanonical).to.equal(params.name.toLowerCase());
            expect(category.group).to.equal(params.group);
            expect(category.class).to.equal(classes.household);
            expect(category.houseId).to.equal(houseId);
            expect(category.userId).to.equal(null);
            expect(category.createdBy).to.equal(user1.id);
            expect(category.updatedBy).to.equal(user1.id);
            expect(category.createdAt).to.exist();
            expect(category.updatedAt).to.exist();
        });
    });
});
