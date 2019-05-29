import * as bunyan from 'bunyan';

export const logger = bunyan.createLogger({
  name: 'big-commerce-cli',
  stream: process.stdout,
  level: 'info',
  serializers: bunyan.stdSerializers,
});
