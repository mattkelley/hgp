import axios, { AxiosInstance } from 'axios';
import * as bunyan from 'bunyan';
import { OrderDTO, OrderStatusDTO, ShippingAddressDTO } from '../dto/BigCommerce.dto';

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
   * Get a BigCommerce OrderStatus by Id
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