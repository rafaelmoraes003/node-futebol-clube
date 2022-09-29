import * as joi from 'joi';

const errorMessage = 'All fields must be filled';

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'any.required': errorMessage,
      'string.empty': errorMessage,
    })
    .required(),
  password: joi
    .string()
    .min(7)
    .messages({
      'any.required': errorMessage,
      'string.empty': errorMessage,
    })
    .required(),
});

export default loginSchema;
