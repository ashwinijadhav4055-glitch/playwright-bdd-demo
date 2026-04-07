import { APIRequestContext } from '@playwright/test';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  age: number;
  gender: string;
  image: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export class UserApiClient {
  private baseUrl: string;

  constructor(private request: APIRequestContext) {
    this.baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
  }

  async getAllUsers(limit = 10, skip = 0): Promise<UsersResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/users?limit=${limit}&skip=${skip}`
    );
    return response.json();
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.request.get(`${this.baseUrl}/users/${id}`);
    return response.json();
  }

  async searchUsers(query: string): Promise<UsersResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/users/search?q=${query}`
    );
    return response.json();
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const response = await this.request.post(`${this.baseUrl}/users/add`, {
      data: userData,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.request.put(`${this.baseUrl}/users/${id}`, {
      data: userData,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async patchUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.request.patch(`${this.baseUrl}/users/${id}`, {
      data: userData,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async deleteUser(id: number): Promise<User & { isDeleted: boolean; deletedOn: string }> {
    const response = await this.request.delete(`${this.baseUrl}/users/${id}`);
    return response.json();
  }

  async getStatusCode(id: number): Promise<number> {
    const response = await this.request.get(`${this.baseUrl}/users/${id}`);
    return response.status();
  }
}
