import { apiRequest } from './api';

export interface CreateProductRequest {
  name: string;
  category: string;
  condition: string;
  price: number;
  description: string;
  images: { [key: number]: string };
  stock: number;
}

export interface ProductResponse {
  productID: string;
}

export interface Product {
  name: string;
  category: string;
  condition: string;
  price: number;
  description: string;
  images: { [key: number]: string };
  sellerID: string;
  stock: number;
  rating: number | null;
}

export const productService = {
  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    return apiRequest<ProductResponse>('/api/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProduct(productID: string): Promise<Product> {
    return apiRequest<Product>(`/api/products/${productID}`);
  }
};
