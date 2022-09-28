import * as joi from 'joi';

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: joi
    .string()
    .min(7)
    .required(),
});

export default loginSchema;
