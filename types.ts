
export enum Category {
  FRESH = 'Fresh Produce',
  SNACKS = 'Healthy Snacks',
  DRY = 'Dry Processed'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  unit: string;
  image: string;
  isPopular?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
