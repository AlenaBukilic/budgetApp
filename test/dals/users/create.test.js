'use strict';

const PasswordHash = require('password-hash');
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

describe('create', () => {

    before(async () => {

        await Database.init();
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should create a user with a passwordHash', async () => {

            const params = {
                data: {
                    email: 'Alena@mail.com',
                    profile: {
                        firstName: 'Alena',
                        lastName: 'Haha'
                    },
                    createdBy: userId,
                    updatedBy: userId
                },
                password: 'password'
            };

            const user = await Users.create(params);

            expect(user.id).to.exist();
            expect(user.type).to.equal(entities.user);
            expect(user.lastPasswordReset).to.exist();
            expect(user.updatedAt).to.exist();
            expect(user.createdAt).to.exist();
            expect(user.createdBy).to.equal(userId);
            expect(user.updatedBy).to.equal(userId);
            expect(user.email).to.equal(params.data.email);
            expect(user.emailCanonical).to.equal(params.data.email.toLowerCase());
            expect(PasswordHash.verify(params.password, user.passwordHash)).to.equal(true);
            expect(user.profile.firstName).to.equal(params.data.profile.firstName);
            expect(user.profile.firstNameCanonical).to.equal(params.data.profile.firstName.toLowerCase());
            expect(user.profile.lastName).to.equal(params.data.profile.lastName);
            expect(user.profile.lastNameCanonical).to.equal(params.data.profile.lastName.toLowerCase());
        });
    });
});
