import { BigCommerceClient } from '../clients';
import { OrderStatus, ShippingMethod, OrderStatusId } from '../types/BigCommerce';
import { logger, obfuscateString } from '../utils';

export interface ServiceConfig {
  storeClientId: string;
  storeAccessToken: string;
  storeHash: string;
  orderId: number;
  updateMode: boolean;
}

export class InStorePickupService {
  storeClient: BigCommerceClient;
  private _config: ServiceConfig;

  constructor(config: ServiceConfig) {
    const { storeHash, storeClientId, storeAccessToken } = config;
    this.config = config;
    this.storeClient = new BigCommerceClient({
      storeHash,
      clientId: storeClientId,
      clientToken: storeAccessToken,
    });
    logger.debug('InStorePickup Service Config=[%j]', this.config);
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
    const { orderId, updateMode } = this.config;

    const orderPromise = this.storeClient.getOrderById(orderId);
    // Shipping addresses endpoint returns an array of addresses. We are only concerned with the first item.
    const shippingAddressPromise = this.storeClient
      .getOrderShippingAddresses(orderId)
      .then(addresses => (Array.isArray(addresses) ? addresses.shift() : addresses));

    try {
      const [order, shippingAddress] = await Promise.all([orderPromise, shippingAddressPromise]);

      // Only update orders that are marked as InStore pickup
      if (shippingAddress.shipping_method !== ShippingMethod.InStorePickUp) {
        const method = shippingAddress.shipping_method;
        logger.info(`Order shipping not compatible. OrderId=[%d] ShippingMethod=[%s]`, orderId, method);
        return { processed: false, message: 'Order shipping method is not compatible' };
      }

      // Only update orders if they are currently in awaiting fulfillment status
      if (order.status !== OrderStatus.AwaitingFulfillment) {
        logger.info(`Order status not compatible. OrderId=[%d] CurrentStatus=[%s]`, orderId, order.status);
        return { processed: false, message: 'Order status is not compatible or may already be shipped' };
      }

      // Use this service in non-update mode to preview the change to an order
      if (!updateMode) {
        const msg = `[Non Update Mode] Would have updated OrderId=[%d] Status=[%s] ShippingMethod=[%s]`;
        logger.info(msg, orderId, order.status, shippingAddress.shipping_method);
        return { processed: false, message: 'Non-update mode' };
      }

      // Update the order status to "Shipped"
      const updatedOrder = await this.storeClient.updateOrderStatus(orderId, { newStatus: OrderStatusId.Shipped });
      logger.info(`Successful updated Order=[%d] to NewStatus=[%s]`, orderId, updatedOrder.status);
      return { processed: true, message: 'Updated InStore PickUp order' };
    } catch (err) {
      logger.error({ err }, `Failed to update OrderId=[%d]`, orderId);
      throw err;
    }
  }
}
