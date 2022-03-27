const Joi = require('joi');

module.exports.postSchema = Joi.object({
    text: Joi.string().required(),
    class: Joi.any().optional()
})

module.exports.profileSchema = Joi.object({
    firstname: Joi.any().optional(),
    lastname: Joi.any().optional(),
    email: Joi.any().optional(),
    birthday: Joi.any().optional(),
    number: Joi.any().optional(),
    course: Joi.any().optional(),
    campus: Joi.any().optional(),
})