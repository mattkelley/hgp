export interface OrderStatusUpdatedBody {
  scope: string;
  store_id: string;
  data: {
    type: 'order';
    id: number;
    status: {
      previous_status_id: number;
      new_status_id: number;
    };
  };
  hash: string;
  created_at: number;
  producer: string;
}

export interface OrderCreatedBody {
  scope: string;
  store_id: string;
  data: {
    type: 'order';
    id: number;
  };
  hash: string;
  created_at: number;
  producer: string;
}
