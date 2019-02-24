import * as bunyan from 'bunyan';

export const logger = bunyan.createLogger({
  name: 'hgp',
  stream: process.stdout,
  level: 'info',
  serializers: bunyan.stdSerializers,
});
