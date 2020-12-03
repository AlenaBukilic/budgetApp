'use strict';

const { ObjectId } = require('mongodb');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const Users = require('../../../lib/dals/entities/users');
const Database = require('../../../lib/dals/db');

exports.lab = Lab.script();
const {
    describe,
    it,
    before,
    after
} = exports.lab;
const { expect } = Code;

const userId = ObjectId();

describe('remove', () => {

    let u1;
    before(async () => {

        await Database.init();

        u1 = await Users.create({
            data: {
                email: 'alena@mail.com',
                emailCanonical: 'alena@mail.com',
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
                emailCanonical: 'mickey@mail.com',
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

        it('should remove single user', async () => {

            const result = await Users.remove(u1.id);

            expect(result.deletedCount).to.equal(1);

            const usersAfterRemoval = await Users.get({});

            expect(usersAfterRemoval.length).to.equal(1);
        });

        it('should not error on non existing user', async () => {

            const result = await Users.remove(ObjectId());

            expect(result.deletedCount).to.equal(0);
        });
    });

    describe('failes', () => {

        it('throws error if user id not provided', async () => {

            let error;
            try {
                await await Users.remove();
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).to.be.equal('User id must be provided.');
        });
    });
});
