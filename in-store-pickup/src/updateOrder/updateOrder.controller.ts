import { APIGatewayProxyHandler } from 'aws-lambda';
import { logger, Response, validateRequestBody } from '../utils';
import { InStorePickUpRequestBody } from '@common/dto/BigCommerce.dto';
import { OrderScope } from '@common/types/BigCommerce';
import { UpdateOrderService } from './updateOrder.service';

// FYI BigCommerce ignores the response body from webhooks
const SUCCESS_MESSAGE = 'OK';

// Ensure the webhook was triggered by a store
const WEBHOOK_PRODUCER_PREFIX = 'stores/';

/**
 * Handles BigCommerce webhooks triggered when a new Order is created.
 * Inspect the order to see if it was marked for "in store pickup" and
 * update its status otherwise just exit.
 *
 * @param event - APIGatewayProxyEvent
 */
const handler: APIGatewayProxyHandler = async event => {
  let body: InStorePickUpRequestBody;

  try {
    body = JSON.parse(event.body);
    validateRequestBody(body, ['scope', 'producer', 'data.id', 'data.type']);
  } catch (err) {
    logger.info({ body: event.body }, 'Invalid webhook body');
    logger.error({ err }, 'Request validation failed');
    return Response.internalServerError(err.message);
  }

  const { scope, producer, data } = body;

  // Check the webhook producer begins with known value
  if (!producer.startsWith(WEBHOOK_PRODUCER_PREFIX)) {
    logger.info(`Skipped OrderId=[%d] Reason=[Invalid webhook Producer=[%s]]`, data.id, producer);
    return Response.success(SUCCESS_MESSAGE);
  }

  // Check the webhook scope is for a newly created order
  if (scope !== OrderScope.created) {
    logger.info(`Skipped OrderId=[%d] Reason=[Invalid webhook Scope=[$s]]`, data.id, scope);
    return Response.success(SUCCESS_MESSAGE);
  }

  const service = new UpdateOrderService({
    storeClientId: process.env.STORE_CLIENT_ID,
    storeAccessToken: process.env.STORE_ACCESS_TOKEN,
    storeHash: producer.slice(WEBHOOK_PRODUCER_PREFIX.length),
    orderId: data.id,
    updateMode: false,
  });

  try {
    const { processed, message } = await service.exec();
    if (processed) {
      logger.info('Processed OrderId=[%d]', data.id);
    } else {
      logger.info('Skipped OrderId=[%d] Reason=[%s]', data.id, message);
    }
    return Response.success(SUCCESS_MESSAGE);
  } catch (err) {
    logger.error({ err }, 'Could not process Order.');
    return Response.internalServerError(err.message);
  }
};

export { handler };
