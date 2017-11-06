import { GraphQLError } from 'graphql';

const ERROR_OBJECT_NOT_FOUND = 'ERROR_OBJECT_NOT_FOUND';
const ERROR_AUTHENTICATION_USER_NOT_LOGIN =
  'ERROR_AUTHENTICATION_USER_NOT_LOGIN';
const ERROR_AUTHENTICATION_PERMISSION_DENI =
  'ERROR_AUTHENTICATION_PERMISSIN_DENI';

class Exception extends GraphQLError {
  constructor({ code, message }) {
    super(message);
    this.code = code;
  }
  static notFoundError(message) {
    return new Exception({ code: ERROR_OBJECT_NOT_FOUND, message });
  }
  static permissionError(message = 'lack of permission') {
    return new Exception({
      code: ERROR_AUTHENTICATION_PERMISSION_DENI,
      message,
    });
  }
}

export default Exception;
