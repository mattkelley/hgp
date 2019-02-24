import { get } from 'lodash';

export { logger } from './logger';

/**
 * Check for an array of keys inside a Request body
 * @param body - A request body object
 * @param requiredKeys - An array of required keys
 */
export function validateRequestBody(body: { [key: string]: any }, requiredKeys: string[]) {
  if (!body) {
    throw new Error('Request body is required');
  }

  for (let i = 0; i < requiredKeys.length; i++) {
    if (!get(body, requiredKeys[i], false)) {
      throw new Error(`Required key ${requiredKeys[i]} is not present in collection`);
    }
  }
}

/**
 * Obfuscate a string containing sensitive information which should not be displayed
 * in log files.
 * @param str - A string
 * @param visibleChars - The number of characters which should be displayed
 */
export function obfuscateString(str: string, visibleChars: number = 0): string {
  if (visibleChars >= str.length) {
    return '*'.repeat(str.length);
  }
  const obfuscated = str.slice(0, -visibleChars);
  return str.replace(obfuscated, '*'.repeat(obfuscated.length));
}

/**
 * Simple success http response factory
 */
export const responseSuccess = () => ({ statusCode: 200 });

/**
 * Simple error http response factory
 * @param message - Error message
 */
export const responseFailure = (message: string) => ({ statusCode: 500, message });
