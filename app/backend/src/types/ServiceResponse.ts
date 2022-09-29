import StatusCodes from './StatusCodes';

interface LoginServiceResponse {
  code: StatusCodes,
  error?: string,
  token?: string,
  data?: string,
}

export default LoginServiceResponse;
