// validation.js
const Joi = require('joi');

const todoSchema = Joi.object({
    task: Joi.string().min(3).required(), // "task" should be a string with at least 3 characters
    completed: Joi.boolean() // "completed" should be a boolean
});

module.exports = todoSchema;
