/**
 * Order statuses
 * @note This is incomplete
 */
export enum OrderStatus {
  AwaitingFulfillment = 'Awaiting Fulfillment',
}

/**
 * Shipping methods
 * @note This is incomplete
 */
export enum ShippingMethod {
  InStorePickUp = 'Pickup In Store',
  ByWeight = 'Ship by Weight',
}

/**
 * Order status Ids
 */
export enum OrderStatusId {
  Incomplete = 0,
  Pending = 1,
  Shipped = 2,
  PartiallyShipped = 3,
  Refunded = 4,
  Cancelled = 5,
  Declined = 6,
  AwaitingPayment = 7,
  AwaitingPickup = 8,
  AwaitingShipment = 9,
  Completed = 10,
  AwaitingFulfillment = 11,
  ManualVerificationRequired = 12,
  Disputed = 13,
  PartiallyRefunded = 14,
}

/**
 * Order scopes
 * @note This is incomplete
 */
export enum OrderScope {
  created = 'store/order/created',
  statusUpdated = 'store/order/statusUpdated',
}
