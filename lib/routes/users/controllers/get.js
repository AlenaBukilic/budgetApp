'use strict';

// const Facade = require('../../../app-facade');
// const User = Facade.issue;
const Joi = require('@hapi/joi');

/**
 * @namespace Controllers.issue.get
 */

module.exports = {
    validate: {
        options: { stripUnknown: true },
        params: {
            teamId: Joi.string().required(),
            labelId: Joi.string().required()
        },
        query: {
            valueIds: Joi.array().items(Joi.string()).single()
        }
    },
    handler: async (request, reply) => {

        try {
            const result = await request.server.methods.facade.labels.isAssigned({
                teamId: request.params.teamId,
                userId: request.auth.credentials.id,
                labelId: request.params.labelId,
                valueIds: request.query.valueIds
            });
            return reply(result);
        }
        catch (err) {
            return reply(err);
        }
    },
    tags: ['api'],
    description: 'Returns boolean if label for that team is assigened or not',
    notes: 'Returns true/false'
};