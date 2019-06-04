import { UpdateOrderService } from '../../updateOrder/updateOrderService';
import { MockOrderFactory } from '../fixtures/bigCommerce.fixture';

describe('UpdateOrderService', () => {
  describe('UpdateOrderService.exec() should process only eligible Orders', () => {
    let service: UpdateOrderService;
    const orderId = 123;

    beforeEach(() => {
      service = new UpdateOrderService({
        storeClientId: 'client-id',
        storeAccessToken: 'access-token',
        storeHash: 'store-hash',
        orderId,
      });
      service.storeClient.getOrderShippingAddresses = jest.fn();
    });

    it('should not process Incomplete orders', async () => {
      const order = MockOrderFactory.pendingOrder();
      service.storeClient.getOrderById = jest.fn().mockResolvedValue(order);

      const result = await service.exec();
      expect(service.storeClient.getOrderById).toHaveBeenCalledWith(orderId);
      expect(service.storeClient.getOrderShippingAddresses).not.toHaveBeenCalled();
      expect(result).toStrictEqual({
        processed: false,
        message: 'OrderStatus is less than AwaitingFulfillment',
      });
    });

    /**
     0	Incomplete	An incomplete order happens when a shopper reached the payment page, but did not complete the transaction.
     1	Pending	Customer started the checkout process, but did not complete it.
     2	Shipped	Order has been shipped, but receipt has not been confirmed; seller has used the Ship Items action.
     3	Partially Shipped	Only some items in the order have been shipped, due to some products being pre-order only or other reasons.
     4	Refunded	Seller has used the Refund action.
     5	Cancelled	Seller has cancelled an order, due to a stock inconsistency or other reasons.
     6	Declined	Seller has marked the order as declined for lack of manual payment, or other reasons.
     7	Awaiting Payment	Customer has completed checkout process, but payment has yet to be confirmed.
     8	Awaiting Pickup	Order has been pulled, and is awaiting customer pickup from a seller-specified location.
     9	Awaiting Shipment	Order has been pulled and packaged, and is awaiting collection from a shipping provider.
     10	Completed
    */

    // TODO create test for the status it should process
  });
});
