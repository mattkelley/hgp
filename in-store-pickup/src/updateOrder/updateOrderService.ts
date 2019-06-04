import { BigCommerceClient } from '@common/clients';
import { ShippingMethod, OrderStatusId } from '@common/types/BigCommerce';
import { logger, obfuscateString } from '../utils';

export interface ServiceConfig {
  storeClientId: string;
  storeAccessToken: string;
  storeHash: string;
  orderId: number;
}

export class UpdateOrderService {
  storeClient: BigCommerceClient;
  private _config: ServiceConfig;

  constructor(config: ServiceConfig) {
    const { storeHash, storeClientId, storeAccessToken } = config;
    this.config = config;
    this.storeClient = new BigCommerceClient({
      storeHash,
      clientId: storeClientId,
      clientToken: storeAccessToken,
      logger,
    });
    logger.debug('UpdateOrderService Service Config=[%j]', this.config);
  }

  /**
   * Get the service config while obfuscating the BigCommerce API credentials
   */
  get config() {
    const storeAccessToken = obfuscateString(this._config.storeAccessToken, 5);
    const storeClientId = obfuscateString(this._config.storeClientId, 5);
    return { ...this._config, storeAccessToken, storeClientId };
  }

  /**
   * Set the config for the service
   */
  set config(val: ServiceConfig) {
    this._config = val;
  }

  /**
   * The main "execute" service method.
   */
  async exec(): Promise<{ processed: boolean; message: string }> {
    const { orderId } = this.config;

    // Get the Order to see if it has the correct status
    try {
      const order = await this.storeClient.getOrderById(orderId);
      // The order is created but has not reached AwaitingFulfillment status
      if (order.status_id < OrderStatusId.AwaitingFulfillment) {
        return { processed: false, message: 'OrderStatus is less than AwaitingFulfillment' };
      }
      // The order is created and has progressed past AwaitingFulfillment status
      if (order.status_id > OrderStatusId.AwaitingFulfillment) {
        return { processed: false, message: 'OrderStatus is greater than AwaitingFulfillment' };
      }
    } catch (err) {
      logger.error({ err }, `Failed to update OrderId=[%d]`, orderId);
      return { processed: false, message: err.message };
    }

    // Get the Order ShippingAddresses to see if the Order is marked for "In Store Pickup"
    try {
      const addresses = await this.storeClient.getOrderShippingAddresses(orderId);
      const shippingAddress = Array.isArray(addresses) ? addresses.shift() : addresses;
      // Only update orders that are marked as InStore pickup
      if (shippingAddress.shipping_method !== ShippingMethod.InStorePickUp) {
        const method = shippingAddress.shipping_method;
        logger.info(`ShippingMethod not compatible. OrderId=[%d] ShippingMethod=[%s]`, orderId, method);
        return { processed: false, message: 'Order shipping method is not compatible' };
      }
    } catch (err) {
      logger.error({ err }, `Failed to update OrderId=[%d]`, orderId);
      return { processed: false, message: err.message };
    }

    // Update the Order to "shipped"
    try {
      const updatedOrder = await this.storeClient.updateOrderStatus(orderId, { newStatus: OrderStatusId.Shipped });
      logger.info(`Successful update of OrderId=[%d] to NewStatus=[%s]`, orderId, updatedOrder.status);
      return { processed: true, message: 'Updated In Store Pick Up order' };
    } catch (err) {
      logger.error({ err }, `Failed to update OrderId=[%d]`, orderId);
      return { processed: false, message: err.message };
    }
  }
}
