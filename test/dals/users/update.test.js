'use strict';

const { ObjectId } = require('mongodb');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

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

describe('update', () => {

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

        it('should update a single user', async () => {

            const id = u1.id
            const data = {
                profile: { firstName: 'Luke' }
            };
            const user = await Users.update(id, data);

            expect(user.profile.firstName).to.equal('Luke');
            expect(user.id).to.exist();
            expect(user.type).to.equal(entities.user);
        });

        it('should update multyple properties of a single user', async () => {

            const id = u1.id
            const data = {
                profile: { lastName: 'Skywalker' },
                email: 'skyBest@mail.com'
            };
            const user = await Users.update(id, data);

            expect(user.profile.lastName).to.equal('Skywalker');
            expect(user.emailCanonical).to.equal(data.email.toLowerCase());
            expect(user.id).to.exist();
            expect(user.type).to.equal(entities.user);
        });


    });

    describe('failes', () => {

        let error;

        it('throws error if user id not provided', async () => {

            try {
                await Users.update();
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).to.be.equal('User id must be provided.');
        });

        it('throws error on non existing user', async () => {

            try {
                await Users.update(ObjectId(), {});
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
