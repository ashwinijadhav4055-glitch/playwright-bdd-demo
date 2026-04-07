import { APIRequestContext } from '@playwright/test';

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export class AuthApiClient {
  private baseUrl: string;

  constructor(private request: APIRequestContext) {
    this.baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.request.post(`${this.baseUrl}/auth/login`, {
      data: { username, password, expiresInMins: 30 },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async loginWithEnvCredentials(): Promise<AuthResponse> {
    const username = process.env.API_USERNAME || 'emilys';
    const password = process.env.API_PASSWORD || 'emilyspass';
    return this.login(username, password);
  }

  async getAuthMe(token: string): Promise<AuthResponse> {
    const response = await this.request.get(`${this.baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await this.request.post(`${this.baseUrl}/auth/refresh`, {
      data: { refreshToken, expiresInMins: 30 },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async getStatusCode(username: string, password: string): Promise<number> {
    const response = await this.request.post(`${this.baseUrl}/auth/login`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.status();
  }
}
