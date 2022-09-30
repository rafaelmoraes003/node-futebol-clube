import * as joi from 'joi';
import CustomError from '../types/CustomError';
import StatusCodes from '../types/StatusCodes';

const validateBody = (schema: joi.ObjectSchema, obj: any): void => {
  const { error } = schema.validate(obj);

  if (error) {
    const errorMessage = error.details[0].message;
    const status = errorMessage.includes('filled')
      ? StatusCodes.BAD_REQUEST
      : StatusCodes.SEMANTIC_ERROR;

    throw new CustomError(
      status,
      errorMessage,
    );
  }
};

export default validateBody;
