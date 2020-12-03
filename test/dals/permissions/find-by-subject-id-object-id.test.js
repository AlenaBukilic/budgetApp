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

        const params = {
            createdBy: userId,
            updatedBy: userId,
            subjectId: userId,
            subjectType: entities.user,
            objectId: houseId,
            objectType: entities.house,
            permission: permissions.admin
        };
        await Permissions.create(params);
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should find a permission', async () => {

            const params = {
                subjectId: userId,
                objectId: houseId
            };

            const permission = await Permissions.findBySubjectIdObjectId(params);

            expect(permission.id).to.exist();
            expect(permission.type).to.equal(entities.permission);
            expect(permission.subjectId).to.equal(params.subjectId);
            expect(permission.subjectType).to.equal(entities.user);
            expect(permission.objectId).to.equal(params.objectId);
            expect(permission.objectType).to.equal(entities.house);
            expect(permission.permission).to.equal(permissions.admin);
            expect(permission.createdBy).to.equal(userId);
            expect(permission.updatedBy).to.equal(userId);
            expect(permission.createdAt).to.exist();
            expect(permission.updatedAt).to.exist();
        });
    });

    describe('fails', () => {

        let error;

        it('should throw on non existing permission', async () => {

            const params = {
                subjectId: userId,
                objectId: ObjectId(),
            };

            try {
                await Permissions.findBySubjectIdObjectId(params);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.exist();
            expect(error.output.statusCode).equal(404);
            expect(error.message).equal('Permission not found.');
        });
    });
});
