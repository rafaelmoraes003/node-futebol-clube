import * as joi from 'joi';
import CustomError from '../types/CustomError';
import StatusCodes from '../types/StatusCodes';

interface IBody {
  email: string,
  password: string,
}

const validateBody = (schema: joi.ObjectSchema, obj: IBody): void => {
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
