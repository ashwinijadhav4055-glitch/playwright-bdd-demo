import { APIRequestContext } from '@playwright/test';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export class ProductApiClient {
  private baseUrl: string;

  constructor(private request: APIRequestContext) {
    this.baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
  }

  async getAllProducts(limit = 10, skip = 0): Promise<ProductsResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/products?limit=${limit}&skip=${skip}`
    );
    return response.json();
  }

  async getProductById(id: number): Promise<Product> {
    const response = await this.request.get(`${this.baseUrl}/products/${id}`);
    return response.json();
  }

  async searchProducts(query: string): Promise<ProductsResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/products/search?q=${query}`
    );
    return response.json();
  }

  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/products/category/${category}`
    );
    return response.json();
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await this.request.post(`${this.baseUrl}/products/add`, {
      data: productData,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await this.request.put(`${this.baseUrl}/products/${id}`, {
      data: productData,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async patchProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await this.request.patch(`${this.baseUrl}/products/${id}`, {
      data: productData,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async deleteProduct(id: number): Promise<Product & { isDeleted: boolean; deletedOn: string }> {
    const response = await this.request.delete(`${this.baseUrl}/products/${id}`);
    return response.json();
  }

  async getStatusCode(id: number): Promise<number> {
    const response = await this.request.get(`${this.baseUrl}/products/${id}`);
    return response.status();
  }
}
