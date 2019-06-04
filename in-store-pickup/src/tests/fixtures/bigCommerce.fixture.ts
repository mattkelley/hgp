import { OrderDTO } from '@common/dto/BigCommerce.dto';
import { OrderStatusId } from '@common/types/BigCommerce';

export class RequestBodyFixtures {
  customerUpdated() {
    return {
      scope: 'store/customer/updated',
      store_id: '12345',
      data: { type: 'customer', id: 9876 },
      hash: 'b8f4f5f4f7b91099b9857d574641d1795548554e',
      created_at: 1549227050,
      producer: 'stores/sdfresduhuh',
    };
  }
  orderCreated() {
    return {
      scope: 'store/order/created',
      store_id: '1000060598',
      data: {
        type: 'order',
        id: 2749,
      },
      hash: 'e3d89eb52d7e49ec279bbd0cdb3842e20bbc9213',
      created_at: 1549832453,
      producer: 'stores/plbed37zdn',
    };
  }
  testCCNumber() {
    return '4111111111111111';
  }
}

const basicOrderFactory = (): OrderDTO => {
  return {
    id: 123,
    customer_id: 1,
    date_created: '',
    date_modified: '',
    date_shipped: '',
    status_id: 0,
    status: 'Incomplete',
    subtotal_ex_tax: '',
    subtotal_inc_tax: '',
    subtotal_tax: '',
    base_shipping_cost: '',
    shipping_cost_ex_tax: '',
    shipping_cost_inc_tax: '',
    shipping_cost_tax: '',
    shipping_cost_tax_class_id: 0,
    base_handling_cost: '',
    handling_cost_ex_tax: '',
    handling_cost_inc_tax: '',
    handling_cost_tax: '',
    handling_cost_tax_class_id: 0,
    base_wrapping_cost: '',
    wrapping_cost_ex_tax: '',
    wrapping_cost_inc_tax: '',
    wrapping_cost_tax: '',
    wrapping_cost_tax_class_id: 0,
    total_ex_tax: '',
    total_inc_tax: '',
    total_tax: '',
    items_total: 0,
    items_shipped: 0,
    payment_method: '',
    payment_provider_id: '',
    payment_status: '',
    refunded_amount: '',
    order_is_digital: false,
    store_credit_amount: '',
    gift_certificate_amount: '',
    ip_address: '',
    geoip_country: '',
    geoip_country_iso2: '',
    currency_id: 0,
    currency_code: '',
    currency_exchange_rate: '',
    default_currency_id: 0,
    default_currency_code: '',
    staff_notes: '',
    customer_message: '',
    discount_amount: '',
    coupon_discount: '',
    shipping_address_count: 0,
    is_deleted: true,
    ebay_order_id: '',
    cart_id: '',
    billing_address: {
      first_name: '',
      last_name: '',
      company: '',
      street_1: '',
      street_2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      country_iso2: '',
      phone: '',
      email: '',
    },
    is_email_opt_in: false,
    credit_card_type: null,
    order_source: '',
    channel_id: 0,
    external_source: null,
    products: {
      url: '',
      resource: '',
    },
    shipping_addresses: {
      url: '',
      resource: '',
    },
    coupons: {
      url: '',
      resource: '',
    },
    external_id: null,
    external_merchant_id: null,
    tax_provider_id: '',
    custom_status: '',
  };
};

export class MockOrderFactory {
  static pendingOrder(): OrderDTO {
    return { ...basicOrderFactory(), status_id: OrderStatusId.Pending, status: 'pending' };
  }
}
