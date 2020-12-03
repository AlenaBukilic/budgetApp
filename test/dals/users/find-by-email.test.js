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

describe('findByEmail', () => {

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

        it('should find user by email', async () => {

            const params = { email: 'AlenA@mail.com' };

            const user = await Users.findByEmail(params);

            expect(user.email).to.equal(u1.email);
            expect(user.id).to.exist();
            expect(user.type).to.equal(entities.user);
        });

        it('should find user by emailCanonical', async () => {

            const params = { emailCanonical: 'alena@mail.com' };

            const user = await Users.findByEmail(params);

            expect(user.email).to.equal(u1.email);
            expect(user.id).to.exist();
            expect(user.type).to.equal(entities.user);
        });
    });

    describe('failes', () => {

        let error;

        it('throws error if neither email nor emailCanonical is provided', async () => {

            try {
                await Users.findByEmail({});
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).to.be.equal('Either email or emailCanonical must be provided.');
        });

        it('throws not found error for non existing user', async () => {

            const params = { email: 'some@mail.com' };

            try{
                await Users.findByEmail(params);
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
