'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { ObjectId } = require('mongoose').Types;

const Incomes = require('../../../lib/dals/entities/incomes');
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

        it('should create an income', async () => {

            params = {
                categoryId,
                createdBy: userId,
                updatedBy: userId,
                week: 1,
                year: 2020,
                objectId: userId,
                objectType: entities.user
            };

            const income = await Incomes.create(params);

            expect(income.id).to.exist();
            expect(income.type).to.equal(entities.income);
            expect(income.categoryId).to.equal(params.categoryId);
            expect(income.objectId).to.equal(params.objectId);
            expect(income.objectType).to.equal(params.objectType);
            expect(income.week).to.equal(params.week);
            expect(income.month).to.equal(null);
            expect(income.year).to.equal(params.year);
            expect(income.createdBy).to.equal(userId);
            expect(income.updatedBy).to.equal(userId);
            expect(income.createdAt).to.exist();
            expect(income.updatedAt).to.exist();
        });
    });
});
