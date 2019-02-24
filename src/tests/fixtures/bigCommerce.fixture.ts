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
