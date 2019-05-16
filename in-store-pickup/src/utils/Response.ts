import HttpStatus from 'http-status-codes';
import { APIGatewayProxyResult } from 'aws-lambda';

export class Response {
  /**
   * Success response factory for ApiGatewayProxy
   * @param message - A success message
   */
  static success(message: string = 'OK'): APIGatewayProxyResult {
    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify({ message }),
    };
  }
  /**
   * Internal Server Errors response factory for ApiGatewayProxy
   * @param message - A error message
   */
  static internalServerError(message: string = 'Internal Server Error'): APIGatewayProxyResult {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message }),
    };
  }
}
