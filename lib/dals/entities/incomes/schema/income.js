'use strict';

const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const Constants = require('../../../../constants');

const { entities } = Constants.entities;

const incomeSchema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, required: true },
    objectId: { type: Schema.Types.ObjectId, required: true },
    objectType: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
    week: { type: Number, default: null },
    month: { type: Number, default: null },
    year: { type: Number, required: true },
}, { timestamps: true });

incomeSchema.index({ categoryId: 1 });
incomeSchema.index({ objectId: 1, objectType: 1 });
incomeSchema.index({ createdAt: 1 });
incomeSchema.index({ updatedAt: 1 });

incomeSchema.options.toJSON = {

    transform: (doc, ret) => {

        ret.id = ret._id;
        ret.type = entities.income;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = Mongoose.model('Income', incomeSchema);
