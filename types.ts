export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  images: string[]; // Array of 4 image URLs
  rating: number;
  reviews: number;
  stock: number;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}