'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Permissions = require('../../../lib/dals/entities/permissions');
const Database = require('../../../lib/dals/db');
const Constants = require('../../../lib/constants');

const { entities } = Constants.entities;
const { permissions } = Constants.permissions;

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

describe('create', () => {

    before(async () => {

        await Database.init();
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        let params;

        it('should create a permission', async () => {

            params = {
                createdBy: userId,
                updatedBy: userId,
                subjectId: userId,
                subjectType: entities.user,
                objectId: houseId,
                objectType: entities.house,
                permission: permissions.admin
            };

            const permission = await Permissions.create(params);

            expect(permission.id).to.exist();
            expect(permission.type).to.equal(entities.permission);
            expect(permission.subjectId).to.equal(params.subjectId);
            expect(permission.subjectType).to.equal(params.subjectType);
            expect(permission.objectId).to.equal(params.objectId);
            expect(permission.objectType).to.equal(params.objectType);
            expect(permission.permission).to.equal(params.permission);
            expect(permission.createdBy).to.equal(userId);
            expect(permission.updatedBy).to.equal(userId);
            expect(permission.createdAt).to.exist();
            expect(permission.updatedAt).to.exist();
        });
    });

    describe('fails', () => {

        let params, error;

        it('should throw on unsupported objectType', async () => {

            params = {
                createdBy: userId,
                updatedBy: userId,
                subjectId: userId,
                subjectType: entities.user,
                objectId: houseId,
                objectType: 'text',
                permission: permissions.admin
            };

            try {
                await Permissions.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Permission validation failed: objectType: `text` is not a valid enum value for path `objectType`.');
        });

        it('should throw on unsupported subjectType', async () => {

            params = {
                createdBy: userId,
                updatedBy: userId,
                subjectId: userId,
                subjectType: 'text',
                objectId: houseId,
                objectType: entities.house,
                permission: permissions.admin
            };

            try {
                await Permissions.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Permission validation failed: subjectType: `text` is not a valid enum value for path `subjectType`.');
        });

        it('should throw on unsupported subjectType', async () => {

            params = {
                createdBy: userId,
                updatedBy: userId,
                subjectId: userId,
                subjectType: entities.user,
                objectId: houseId,
                objectType: entities.house,
                permission: 'blah'
            };

            try {
                await Permissions.create(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.message).equal('Permission validation failed: permission: `blah` is not a valid enum value for path `permission`.');
        });

    });
});
