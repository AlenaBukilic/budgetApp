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

describe('dals removeByHouseId', () => {

    before(async () => {

        await Database.init();

        await Permissions.create({
            createdBy: userId,
            updatedBy: userId,
            subjectId: userId,
            subjectType: entities.user,
            objectId: houseId,
            objectType: entities.house,
            permission: permissions.admin
        });
        await Permissions.create({
            createdBy: userId,
            updatedBy: userId,
            subjectId: userId,
            subjectType: entities.user,
            objectId: houseId,
            objectType: entities.house,
            permission: permissions.member
        });
        await Permissions.create({
            createdBy: userId,
            updatedBy: userId,
            subjectId: userId,
            subjectType: entities.user,
            objectId: ObjectId(),
            objectType: entities.house,
            permission: permissions.admin
        });

    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        it('should remove Permissions by houseId', async () => {

            const result = await Permissions.removeByHouseId({ houseId });

            expect(result.deletedCount).to.equal(2);
            expect(result.success).to.equal(true);
        });

        it('should not remove a house if no matches', async () => {

            const result = await Permissions.removeByHouseId({ houseId: ObjectId() });

            expect(result.deletedCount).to.equal(0);
            expect(result.success).to.equal(true);
        });
    });
});
