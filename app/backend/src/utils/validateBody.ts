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
    throw new CustomError(
      StatusCodes.SEMANTIC_ERROR,
      error.details[0].message,
    );
  }
};

export default validateBody;
