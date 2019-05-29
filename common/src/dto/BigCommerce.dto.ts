export interface InStorePickUpRequestBody {
  scope: string;
  store_id: string;
  data: {
    type: string;
    id: number;
  };
  hash: string;
  created_at: number;
  producer: string;
}

export interface BillingAddressDTO {
  first_name: string;
  last_name: string;
  company: string;
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  country_iso2: string;
  phone: string;
  email: string;
  // form_fields: [];
}

export interface OrderDTO {
  id: number;
  customer_id: number;
  date_created: string;
  date_modified: string;
  date_shipped: string;
  status_id: number;
  status: string;
  subtotal_ex_tax: string;
  subtotal_inc_tax: string;
  subtotal_tax: string;
  base_shipping_cost: string;
  shipping_cost_ex_tax: string;
  shipping_cost_inc_tax: string;
  shipping_cost_tax: string;
  shipping_cost_tax_class_id: number;
  base_handling_cost: string;
  handling_cost_ex_tax: string;
  handling_cost_inc_tax: string;
  handling_cost_tax: string;
  handling_cost_tax_class_id: number;
  base_wrapping_cost: string;
  wrapping_cost_ex_tax: string;
  wrapping_cost_inc_tax: string;
  wrapping_cost_tax: string;
  wrapping_cost_tax_class_id: number;
  total_ex_tax: string;
  total_inc_tax: string;
  total_tax: string;
  items_total: number;
  items_shipped: number;
  payment_method: string;
  payment_provider_id: string;
  payment_status: string;
  refunded_amount: string;
  order_is_digital: boolean;
  store_credit_amount: string;
  gift_certificate_amount: string;
  ip_address: string;
  geoip_country: string;
  geoip_country_iso2: string;
  currency_id: number;
  currency_code: string;
  currency_exchange_rate: string;
  default_currency_id: number;
  default_currency_code: string;
  staff_notes: string;
  customer_message: string;
  discount_amount: string;
  coupon_discount: string;
  shipping_address_count: number;
  is_deleted: true;
  ebay_order_id: string;
  cart_id: string;
  billing_address: BillingAddressDTO;
  is_email_opt_in: boolean;
  credit_card_type: null;
  order_source: string;
  channel_id: number;
  external_source: null;
  products: {
    url: string;
    resource: string;
  };
  shipping_addresses: {
    url: string;
    resource: string;
  };
  coupons: {
    url: string;
    resource: string;
  };
  external_id: null;
  external_merchant_id: null;
  tax_provider_id: string;
  custom_status: string;
}

export interface OrderStatusDTO {
  id: number;
  name: string;
  system_label: string;
  custom_label: string;
  system_description: string;
  order: number;
}

export interface ShippingAddressDTO {
  id: number;
  order_id: number;
  first_name: string;
  last_name: string;
  company: string;
  street_1: string;
  street_2: string;
  city: string;
  zip: string;
  country: string;
  country_iso2: string;
  state: string;
  email: string;
  phone: string;
  items_total: number;
  items_shipped: number;
  shipping_method: string;
  base_cost: string;
  cost_ex_tax: string;
  cost_inc_tax: string;
  cost_tax: string;
  cost_tax_class_id: number;
  base_handling_cost: string;
  handling_cost_ex_tax: string;
  handling_cost_inc_tax: string;
  handling_cost_tax: string;
  handling_cost_tax_class_id: number;
  shipping_zone_id: number;
  shipping_zone_name: string;
  shipping_quotes: {
    url: string;
    resource: string;
  };
  // form_fields: [];
}

export interface WebhookDTO {
  id: number;
  client_id: string;
  store_hash: string;
  scope: string;
  destination: string;
  headers: { [key: string]: string };
  is_active: boolean;
  created_at: number;
  updated_at: number;
}
