'use strict';

const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const Constants = require('../../../../constants');

const { entities } = Constants.entities;
const subjTypes = [entities.user];
const objTypes = [entities.house];
const permissions = Object.values(Constants.permissions.permissions);

const permissionSchema = new Schema({
    subjectId: { type: Schema.Types.ObjectId, required: true },
    subjectType: { type: String, required: true, enum: subjTypes },
    objectId: { type: Schema.Types.ObjectId, required: true },
    objectType: { type: String, required: true, enum: objTypes },
    permission: { type: String, required: true, enum: permissions },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });

permissionSchema.index({ subjectId: 1, objectId: 1 }, { unique: true });
permissionSchema.index({ objectId: 1, objectType: 1 });
permissionSchema.index({ createdAt: 1 });
permissionSchema.index({ updatedAt: 1 });

permissionSchema.options.toJSON = {

    transform: (doc, ret) => {

        ret.id = ret._id;
        ret.type = entities.permission;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = Mongoose.model('Permission', permissionSchema);
