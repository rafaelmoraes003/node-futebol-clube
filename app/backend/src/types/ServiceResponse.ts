import StatusCodes from './StatusCodes';

export interface LoginServiceResponse {
  code: StatusCodes,
  error?: string,
  token?: string,
  data?: string,
}

export interface ServiceResponse<T> {
  code: StatusCodes,
  error?: string,
  data?: T,
}
