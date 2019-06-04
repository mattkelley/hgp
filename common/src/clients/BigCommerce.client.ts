import axios, { AxiosInstance } from 'axios';
import * as bunyan from 'bunyan';
import { OrderDTO, OrderStatusDTO, ShippingAddressDTO, WebhookDTO } from '../dto/BigCommerce.dto';
import { OrderStatusId } from '../types/BigCommerce';

export interface ClientOptions {
  storeHash: string;
  clientId: string;
  clientToken: string;
  logger: bunyan;
}

export interface ClientConfig {
  storeHash: string;
  clientId: string;
  clientToken: string;
}

export interface RegisterWebhookConfig {
  scope: string;
  destination: string;
  headers: { [key: string]: string };
}

export class BigCommerceClient {
  config: ClientConfig;
  axios: AxiosInstance;
  logger: bunyan;

  constructor(conf: ClientOptions) {
    const { storeHash, clientId, clientToken } = conf;
    this.logger = conf.logger;
    this.config = { storeHash, clientId, clientToken };
    const headers = {
      'X-Auth-Client': clientId,
      'X-Auth-Token': clientToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    this.axios = axios.create({
      baseURL: `https://api.bigcommerce.com/stores/${storeHash}`,
      headers,
    });
  }

  /**
   * Get all registered webhooks
   */
  async getAllWebhooks(): Promise<WebhookDTO[]> {
    const requestPath = `/v2/hooks`;
    this.logger.info('Get webhooks for StoreHash=[%s] URLPath=[%s]', this.config.storeHash, requestPath);
    try {
      const req = await this.axios(requestPath);
      return req.data;
    } catch (err) {
      this.logger.warn({ err }, 'Failed to get webhooks for StoreHash=[%s]', this.config.storeHash);
      throw err;
    }
  }

  /**
   * Register a BigCommerce webhook
   * @param conf.scope - The webhooks scope e.g /stores/order/created
   * @param conf.destination - The webhook URL destination to send POST request
   * @param conf.headers - The headers to be included in the POST request to destination
   * @returns BigCommerceWebhookDTO - The registered webhook
   */
  async registerWebhook(conf: RegisterWebhookConfig): Promise<WebhookDTO> {
    const { scope, destination, headers } = conf;
    const requestPath = '/v2/hooks';
    this.logger.info(
      'Register webhook Scope=[%s] Destination=[%s] for StoreHash=[%s] URLPath=[%s]',
      scope,
      destination,
      this.config.storeHash,
      requestPath,
    );
    const data = { scope, destination, headers, is_active: true };
    try {
      const req = await this.axios({ method: 'post', url: requestPath, data });
      return req.data;
    } catch (err) {
      // Note: BigCommerce returns a 400 error if the webhook is considered a "duplicate"
      // Could handle that error in the future, as we should probably not throw.
      this.logger.warn({ err }, 'Failed to register Webhook for StoreHash=[%s]', this.config.storeHash);
      throw err;
    }
  }

  /**
   * Remove a BigCommerce webhook by Id
   * @param id - The webhook Id to remove
   * @returns [BigCommerceWebhookDTO] - The removed webhook
   */
  async removeWebhookById(id: string): Promise<WebhookDTO> {
    const requestPath = `/v2/hooks/${id}`;
    this.logger.info('Remove WebhookId=[%d] for StoreHash=[%s] URLPath=[%s]', id, this.config.storeHash, requestPath);
    try {
      const req = await this.axios.delete(requestPath);
      return req.data;
    } catch (err) {
      this.logger.warn({ err }, 'Failed to remove WebhookId=[%d] for StoreHash=[%s]', id, this.config.storeHash);
      throw err;
    }
  }

  /**
   * Remove all the registered BigCommerce webhooks
   * @returns [BigCommerceWebhookDTO][] - The removed webhooks
   */
  async removeAllWebhooks(): Promise<WebhookDTO[]> {
    this.logger.info('Removing all webhooks for StoreHash=[%s]', this.config.storeHash);
    const hooks = await this.getAllWebhooks();
    const removedHooks: WebhookDTO[] = [];
    for (const hook of hooks) {
      const resp = await this.removeWebhookById(`${hook.id}`);
      removedHooks.push(resp);
    }
    this.logger.info(`Removed Total=[%d] webhooks for StoreHash=[%s]`, removedHooks.length, this.config.storeHash);
    return removedHooks;
  }

  /**
   * Get a BigCommerce Order by Id
   * @param orderId - The order Id
   */
  async getOrderById(orderId: number): Promise<OrderDTO> {
    const requestPath = `/v2/orders/${orderId}`;
    this.logger.info('Get Order by OrderId=[%d] URLPath=[%s]', orderId, requestPath);
    try {
      const req = await this.axios(requestPath);
      return req.data;
    } catch (err) {
      this.logger.warn({ err }, 'Failed to get Order by OrderId=[%d]', orderId);
      throw err;
    }
  }

  /**
   * Get a BigCommerce Order Status Id
   * @param orderId - The order Id
   */
  async getOrderStatus(orderId: number): Promise<OrderStatusId> {
    const { status_id } = await this.getOrderById(orderId);
    return status_id;
  }

  /**
   * Get a BigCommerce OrderStatus type by Id
   * @param status - The order status id
   */
  async getOrderStatusById(status: number): Promise<OrderStatusDTO> {
    const requestPath = `/v2/order_statuses/${status}`;
    this.logger.info('Get OrderStatus by StatusId=[%d] URLPath=[%s]', status, requestPath);
    try {
      const req = await this.axios(requestPath);
      return req.data;
    } catch (err) {
      this.logger.warn({ err }, 'Failed to get OrderStatus by OrderStatusId=[%d]', status);
      throw err;
    }
  }

  /**
   * Get a BigCommerce Order's Shipping Address by Order Id
   * @param orderId
   */
  async getOrderShippingAddresses(orderId: number): Promise<ShippingAddressDTO[]> {
    const requestPath = `/v2/orders/${orderId}/shippingaddresses`;
    this.logger.info('Get Order shipping addresses by OrderId=[%d] URLPath=[%s]', orderId, requestPath);
    try {
      const req = await this.axios(requestPath);
      return req.data;
    } catch (err) {
      this.logger.warn({ err }, 'Failed to get Order shipping addresses by OrderId=[%d]', orderId);
      throw err;
    }
  }

  /**
   * Update a BigCommerce Order status
   * @param orderId - The order to update
   * @param newStatus - The order's new status
   */
  async updateOrderStatus(orderId: number, conf: { newStatus: number }): Promise<OrderDTO> {
    const requestPath = `/v2/orders/${orderId}`;
    this.logger.info(
      'Update Order status. OrderId=[%d] NewStatus=[%d] URLPath=[%s]',
      orderId,
      conf.newStatus,
      requestPath,
    );
    try {
      const req = await this.axios({
        method: 'put',
        url: `/v2/orders/${orderId}`,
        data: { status_id: conf.newStatus },
      });
      return req.data;
    } catch (err) {
      this.logger.warn({ err }, `Failed to update Order status. OrderId=[${orderId}] NewStatus=[${conf.newStatus}]`);
      throw err;
    }
  }
}
