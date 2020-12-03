'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Users = require('../../../lib/dals/entities/users');
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

describe('dals findById', () => {

    let u1;
    before(async () => {

        await Database.init();

        u1 = await Users.create({
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
        await Users.create({
            data: {
                email: 'mickey@mail.com',
                profile: {
                    firstName: 'Mickey',
                    lastName: 'Mouse'
                },
                createdBy: userId,
                updatedBy: userId,
                isBanned: true
            },
            password: 'hello'
        });
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should find user by id', async () => {

            const user = await Users.findById(u1.id.toString());

            expect(user.email).to.equal(u1.email);
            expect(user.id).to.exist();
            expect(user.type).to.equal(entities.user);
        });
    });

    describe('failes', () => {

        let error;

        it('throws not found error for non existing user', async () => {

            try{
                await Users.findById(ObjectId().toString());
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).to.be.equal(404);
            expect(error.message).to.be.equal('User not found.');
        });
    });
});
