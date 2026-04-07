import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';

When('I send a GET request to retrieve all users', async function (this: CustomWorld) {
  const data = await this.userApiClient.getAllUsers();
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should contain a list of users', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('users');
  const users = this.responseData['users'] as unknown[];
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);
});

Then('the users response should include total count', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('total');
  expect(typeof this.responseData['total']).toBe('number');
});

When('I send a GET request for user with ID {int}', async function (this: CustomWorld, id: number) {
  this.responseStatus = await this.userApiClient.getStatusCode(id);
  const data = await this.userApiClient.getUserById(id);
  this.responseData = data as unknown as Record<string, unknown>;
});

Then('the response should contain user details with id {int}', async function (this: CustomWorld, id: number) {
  expect(this.responseData).toHaveProperty('id', id);
  expect(this.responseData).toHaveProperty('firstName');
  expect(this.responseData).toHaveProperty('email');
});

When('I search for users with keyword {string}', async function (this: CustomWorld, keyword: string) {
  const data = await this.userApiClient.searchUsers(keyword);
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the user search results should not be empty', async function (this: CustomWorld) {
  const users = this.responseData['users'] as unknown[];
  expect(Array.isArray(users)).toBe(true);
});

When('I send a POST request to create a user with the following data:', async function (this: CustomWorld, dataTable: { hashes: () => Array<Record<string, string>> }) {
  const row = dataTable.hashes()[0];
  const data = await this.userApiClient.createUser({
    firstName: row['firstName'],
    lastName: row['lastName'],
    email: row['email'],
    age: parseInt(row['age']),
  });
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 201;
});

Then('the response should contain the created user with firstName {string}', async function (this: CustomWorld, firstName: string) {
  expect(this.responseData).toHaveProperty('id');
  expect(this.responseData['firstName']).toBe(firstName);
});

When('I send a PUT request to update user with ID {int} with lastName {string}', async function (this: CustomWorld, id: number, lastName: string) {
  const data = await this.userApiClient.updateUser(id, { lastName });
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should contain the updated lastName {string}', async function (this: CustomWorld, lastName: string) {
  expect(this.responseData['lastName']).toBe(lastName);
});

When('I send a PATCH request to update user with ID {int} with age {int}', async function (this: CustomWorld, id: number, age: number) {
  const data = await this.userApiClient.patchUser(id, { age });
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response user age should be {int}', async function (this: CustomWorld, age: number) {
  expect(this.responseData['age']).toBe(age);
});

When('I send a DELETE request for user with ID {int}', async function (this: CustomWorld, id: number) {
  const data = await this.userApiClient.deleteUser(id);
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should confirm the user is deleted', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('isDeleted', true);
});
