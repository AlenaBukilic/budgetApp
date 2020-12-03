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

describe('get', () => {

    let u1, u2;
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
                isConfirmed: true,
                isBanned: true
            },
            password: 'password'
        });
        u2 = await Users.create({
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

        it('should get all users', async () => {

            const users = await Users.get({});

            expect(users.length).to.equal(2);
            const usersEmails = [users[0].email, users[1].email];
            expect(usersEmails).to.include(u1.email);
            expect(usersEmails).to.include(u2.email);
            expect(users[0].id).to.exist();
            expect(users[0].type).to.equal(entities.user);
            expect(users[1].id).to.exist();
            expect(users[1].type).to.equal(entities.user);
        });

        it('should get all confirmed users', async () => {

            const users = await Users.get({ isConfirmed: true });

            expect(users.length).to.equal(1);
            expect(users[0].email).to.equal(u1.email);
            expect(users[0].id).to.exist();
            expect(users[0].type).to.equal(entities.user);
        });

        it('should get all banned users', async () => {

            const users = await Users.get({ isBanned: true });

            expect(users.length).to.equal(2);
            const usersEmails = [users[0].email, users[1].email];
            expect(usersEmails).to.include(u1.email);
            expect(usersEmails).to.include(u2.email);
            expect(users[0].id).to.exist();
            expect(users[0].type).to.equal(entities.user);
            expect(users[1].id).to.exist();
            expect(users[1].type).to.equal(entities.user);
        });
        it('should return empty array if no matches', async () => {

            const users = await Users.get({ isBanned: false });

            expect(users).to.be.an.array;
            expect(users.length).to.equal(0);
        });
    });

    describe('failes', () => {

        it('throws error if both isConfirmed and isBanned provided', async () => {

            let error;
            try {
                await Users.get({ isConfirmed: true, isBanned: true });
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).to.be.equal('Only isConfirmed or isBanned can be provided.');
        });
    });
});
