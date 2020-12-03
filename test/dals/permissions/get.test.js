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
const house2Id = ObjectId();
const user2Id = ObjectId();
const house3Id = ObjectId();

describe('create', () => {

    before(async () => {

        await Database.init();

        const params = [
            {
                createdBy: userId,
                updatedBy: userId,
                subjectId: userId,
                subjectType: entities.user,
                objectId: houseId,
                objectType: entities.house,
                permission: permissions.admin
            },
            {
                createdBy: user2Id,
                updatedBy: user2Id,
                subjectId: user2Id,
                subjectType: entities.user,
                objectId: house2Id,
                objectType: entities.house,
                permission: permissions.admin
            },
            {
                createdBy: userId,
                updatedBy: userId,
                subjectId: userId,
                subjectType: entities.user,
                objectId: house3Id,
                objectType: entities.house,
                permission: permissions.admin
            }
        ];
        await Permissions.create(params);
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should find permissions for user', async () => {

            const params = {
                subjectId: userId
            };
            const permissions = await Permissions.get(params);

            expect(permissions.length).to.equal(2);
            const houseIds = [permissions[0].objectId, permissions[1].objectId];
            expect(houseIds).to.include(houseId);
            expect(houseIds).to.include(house3Id);
            expect(permissions[0].id).to.exist();
            expect(permissions[0].type).to.equal(entities.permission);
            expect(permissions[1].id).to.exist();
            expect(permissions[1].type).to.equal(entities.permission);
        });

        it('should find permissions for house', async () => {

            const params = {
                objectId: house2Id
            };
            const permissions = await Permissions.get(params);

            expect(permissions.length).to.equal(1);
            expect(permissions[0].subjectId).to.equal(user2Id);
            expect(permissions[0].id).to.exist();
            expect(permissions[0].type).to.equal(entities.permission);
        });

        it('should return empty array on non existing match', async () => {

            const params = {
                objectId: ObjectId()
            };
            const permissions = await Permissions.get(params);

            expect(permissions.length).to.equal(0);
        });
    });
});
