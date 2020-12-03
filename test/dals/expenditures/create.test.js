'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Expenditures = require('../../../lib/dals/entities/expenditures');
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
const categoryId = ObjectId();

describe('create', () => {

    before(async () => {

        await Database.init();
    });

    after(async() => {

        await Database.dropDatabase();
    });

    describe('succeeds', () => {

        let params;

        it('should create an expenditure', async () => {

            params = {
                categoryId,
                createdBy: userId,
                updatedBy: userId,
                week: 1,
                year: 2020,
                objectId: userId,
                objectType: entities.user
            };

            const expenditure = await Expenditures.create(params);

            expect(expenditure.id).to.exist();
            expect(expenditure.type).to.equal(entities.expenditure);
            expect(expenditure.categoryId).to.equal(params.categoryId);
            expect(expenditure.objectId).to.equal(params.objectId);
            expect(expenditure.objectType).to.equal(params.objectType);
            expect(expenditure.week).to.equal(params.week);
            expect(expenditure.month).to.equal(null);
            expect(expenditure.year).to.equal(params.year);
            expect(expenditure.createdBy).to.equal(userId);
            expect(expenditure.updatedBy).to.equal(userId);
            expect(expenditure.createdAt).to.exist();
            expect(expenditure.updatedAt).to.exist();
        });
    });
});
