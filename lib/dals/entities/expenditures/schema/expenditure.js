'use strict';

const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const Constants = require('../../../../constants');

const { entities } = Constants.entities;

const expenditureSchema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, required: true },
    objectId: { type: Schema.Types.ObjectId, required: true },
    objectType: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
    week: { type: Number, default: null },
    month: { type: Number, default: null },
    year: { type: Number, required: true },
}, { timestamps: true });

expenditureSchema.index({ categoryId: 1 });
expenditureSchema.index({ objectId: 1, objectType: 1 });
expenditureSchema.index({ createdAt: 1 });
expenditureSchema.index({ updatedAt: 1 });

expenditureSchema.options.toJSON = {

    transform: (doc, ret) => {

        ret.id = ret._id;
        ret.type = entities.expenditure;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = Mongoose.model('Expenditure', expenditureSchema);
