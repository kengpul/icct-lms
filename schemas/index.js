const Joi = require('joi');

module.exports.postSchema = Joi.object({
    text: Joi.string().required()
})
