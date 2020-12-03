'use strict';

const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const Constants = require('../../../../constants');

const groups = Object.values(Constants.groups.groups);
const classes = Object.values(Constants.classes.classes);
const { entities } = Constants.entities;

const categorySchema = new Schema({
    name: { type: String, required: true },
    nameCanonical: { type: String, lowercase: true, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
    group: { type: String, enum: groups, required: true },
    class: { type: String, enum: classes, required: true },
    houseId: { type: Schema.Types.ObjectId, default: null },
    userId: { type: Schema.Types.ObjectId, default: null },
}, { timestamps: true });

categorySchema.index({ group: 1, objectType: 1 });
categorySchema.index({ objectId: 1 });
categorySchema.index({ createdAt: 1 });
categorySchema.index({ updatedAt: 1 });

categorySchema.options.toJSON = {

    transform: (doc, ret) => {

        ret.id = ret._id;
        ret.type = entities.category;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = Mongoose.model('Category', categorySchema);
