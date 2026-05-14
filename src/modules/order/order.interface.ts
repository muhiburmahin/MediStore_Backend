export interface IOrderItem {
  medicineId: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  customerId: string;
  shippingAddress: string;
  phone?: string;
  totalAmount: number;
  items: IOrderItem[];
}
