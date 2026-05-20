export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  priceINR: number;
  priceUSDT: number;
  sellerUsername: string;
  category: string;
  link?: string;
  tags: string[];
}

export type ViewState = 'home' | 'marketplace' | 'dashboard';
