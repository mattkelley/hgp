import { Handler } from 'aws-lambda';
import { logger, responseSuccess, responseFailure, validateRequestBody } from './utils';
import { InStorePickUpRequestBody } from './dto/BigCommerce.dto';
import { OrderScope } from './types/BigCommerce';
import { InStorePickupService } from './service';

const WEBHOOK_PRODUCER_PREFIX = 'stores/';

/**
 * Process incoming orders marked for in-store pickup.
 * @param event
 * @param context
 */
async function inStorePickup(event: any) {
  let body: InStorePickUpRequestBody;

  try {
    body = JSON.parse(event.body);
    validateRequestBody(body, ['scope', 'producer', 'data.id', 'data.type']);
  } catch (err) {
    logger.info({ body: event.body }, 'Invalid webhook body');
    logger.error({ err }, 'Request validation failed');
    return responseFailure(err.message);
  }

  const { scope, producer, data } = body;

  // Check the webhook producer begins with known value
  if (!producer.startsWith(WEBHOOK_PRODUCER_PREFIX)) {
    logger.info(`[Skipped] webhook Order=[%d] Reason=[Invalid webhook Producer=[%s]]`, data.id, producer);
    return responseSuccess();
  }

  // Check the webhook scope is for a newly created order
  if (scope !== OrderScope.created) {
    logger.info(`[Skipped] webhook Order=[%d] Reason=[Invalid webhook Scope=[$s]]`, data.id, scope);
    return responseSuccess();
  }

  const service = new InStorePickupService({
    storeClientId: process.env.STORE_CLIENT_ID,
    storeAccessToken: process.env.STORE_ACCESS_TOKEN,
    storeHash: producer.slice(WEBHOOK_PRODUCER_PREFIX.length),
    orderId: data.id,
    updateMode: true,
  });

  try {
    const { processed, message } = await service.exec();
    if (processed) {
      logger.info('[Processed] webhook Order=[%d]', data.id);
    } else {
      logger.info('[Skipped] webhook Order=[%d] Reason=[%s]', data.id, message);
    }
    return responseSuccess();
  } catch (err) {
    logger.error({ err }, 'Could not process Order.');
    return responseFailure(err.message);
  }
}

export const handler: Handler = inStorePickup;
