'use strict';

const CreateHouse = require('./create-house');
const FindHouse = require('./find-house');
const GetHouses = require('./get-houses');
const RemoveHouse = require('./remove-house');

module.exports = {
    createHouse: CreateHouse,
    findHouse: FindHouse,
    getHouses: GetHouses,
    removeHouse: RemoveHouse
};
