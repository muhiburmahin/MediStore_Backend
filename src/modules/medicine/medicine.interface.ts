export interface IMedicine {
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  images?: any;
  categoryId: string;
  sellerId: string;
}
