import StatusCodes from './StatusCodes';

interface LoginServiceResponse {
  code: StatusCodes,
  error?: string,
  token?: string,
}

export default LoginServiceResponse;
