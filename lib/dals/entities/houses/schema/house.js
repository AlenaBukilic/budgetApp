'use strict';

const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const Constants = require('../../../../constants');

const budgets = Object.values(Constants.budgets.budgets);
const currencies = Object.values(Constants.currencies.currencies);
const { entities } = Constants.entities;

const houseSchema = new Schema({
    name: { type: String, required: true },
    nameCanonical: { type: String, lowercase: true, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
    budget: { type: String, enum: budgets, required: true },
    currency: { type: String, enum: currencies, required: true }
}, { timestamps: true });

houseSchema.index({ name: 1 }, { unique: true });
houseSchema.index({ nameCanonical: 1 }, { unique: true });
houseSchema.index({ createdAt: 1 });
houseSchema.index({ updatedAt: 1 });

houseSchema.options.toJSON = {

    transform: (doc, ret) => {

        ret.id = ret._id;
        ret.type = entities.house;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = Mongoose.model('House', houseSchema);
