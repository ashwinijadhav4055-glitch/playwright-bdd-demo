import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';

When('I send a POST request to login with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    const status = await this.authApiClient.getStatusCode(username, password);
    this.responseStatus = status;
    if (status === 200) {
      const data = await this.authApiClient.login(username, password);
      this.responseData = data as unknown as Record<string, unknown>;
      this.authToken = data.accessToken;
    }
  });

Then('the response status should be {int}', async function (this: CustomWorld, status: number) {
  expect(this.responseStatus).toBe(status);
});

Then('the response should contain an access token', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('accessToken');
  expect(typeof this.responseData['accessToken']).toBe('string');
  expect((this.responseData['accessToken'] as string).length).toBeGreaterThan(0);
});

Then('the response should contain user details', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('firstName');
  expect(this.responseData).toHaveProperty('email');
  expect(this.responseData).toHaveProperty('username');
});

Given('I have logged in successfully with valid credentials', async function (this: CustomWorld) {
  const data = await this.authApiClient.loginWithEnvCredentials();
  this.authToken = data.accessToken;
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

When('I request my profile using the auth token', async function (this: CustomWorld) {
  const data = await this.authApiClient.getAuthMe(this.authToken);
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should contain my user information', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('id');
  expect(this.responseData).toHaveProperty('email');
  expect(this.responseData).toHaveProperty('username');
});

When('I refresh the authentication token', async function (this: CustomWorld) {
  const refreshToken = (this.responseData['refreshToken'] as string) || '';
  const data = await this.authApiClient.refreshToken(refreshToken);
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should contain a new access token', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('accessToken');
  expect(typeof this.responseData['accessToken']).toBe('string');
});
