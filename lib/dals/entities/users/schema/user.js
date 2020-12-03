'use strict';

const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const Constants = require('../../../../constants');

const { entities } = Constants.entities;

const userSchema = new Schema({
    email: { type: String, required: true },
    emailCanonical: { type: String, lowercase: true, required: true },
    passwordHash: { type: String, default: null },
    isConfirmed: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    profile: {
        firstName: { type: String, required: true },
        firstNameCanonical: { type: String, lowercase: true, required: true  },
        lastName: { type: String, required: true },
        lastNameCanonical: { type: String, lowercase: true, required: true  }
    },
    lastAuthenticated: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
    lastPasswordReset: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ emailCanonical: 1 }, { unique: true });
userSchema.index({ createdAt: 1 });
userSchema.index({ updatedAt: 1 });

userSchema.options.toJSON = {

    transform: (doc, ret) => {

        ret.id = ret._id;
        ret.type = entities.user;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = Mongoose.model('User', userSchema);
