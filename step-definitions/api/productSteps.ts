import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';

When('I send a GET request to retrieve all products', async function (this: CustomWorld) {
  const data = await this.productApiClient.getAllProducts();
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should contain a list of products', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('products');
  const products = this.responseData['products'] as unknown[];
  expect(Array.isArray(products)).toBe(true);
  expect(products.length).toBeGreaterThan(0);
});

Then('the response should include total count', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('total');
  expect(typeof this.responseData['total']).toBe('number');
});

When('I send a GET request for product with ID {int}', async function (this: CustomWorld, id: number) {
  this.responseStatus = await this.productApiClient.getStatusCode(id);
  const data = await this.productApiClient.getProductById(id);
  this.responseData = data as unknown as Record<string, unknown>;
});

Then('the response should contain product details with id {int}', async function (this: CustomWorld, id: number) {
  expect(this.responseData).toHaveProperty('id', id);
  expect(this.responseData).toHaveProperty('title');
  expect(this.responseData).toHaveProperty('price');
});

When('I search for products with keyword {string}', async function (this: CustomWorld, keyword: string) {
  const data = await this.productApiClient.searchProducts(keyword);
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the search results should contain relevant products', async function (this: CustomWorld) {
  const products = this.responseData['products'] as unknown[];
  expect(Array.isArray(products)).toBe(true);
});

When('I get products in category {string}', async function (this: CustomWorld, category: string) {
  const data = await this.productApiClient.getProductsByCategory(category);
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('all returned products should be in category {string}', async function (this: CustomWorld, category: string) {
  const products = this.responseData['products'] as Array<Record<string, unknown>>;
  products.forEach(p => {
    expect((p['category'] as string).toLowerCase()).toContain(category.toLowerCase());
  });
});

When('I send a POST request to create a product with the following data:', async function (this: CustomWorld, dataTable: { hashes: () => Array<Record<string, string>> }) {
  const row = dataTable.hashes()[0];
  const data = await this.productApiClient.createProduct({
    title: row['title'],
    description: row['description'],
    price: parseFloat(row['price']),
    category: row['category'],
  });
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 201;
});

Then('the response should contain the created product with title {string}', async function (this: CustomWorld, title: string) {
  expect(this.responseData).toHaveProperty('id');
  expect(this.responseData['title']).toBe(title);
});

When('I send a PUT request to update product with ID {int} with title {string}', async function (this: CustomWorld, id: number, title: string) {
  const data = await this.productApiClient.updateProduct(id, { title });
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should contain the updated title {string}', async function (this: CustomWorld, title: string) {
  expect(this.responseData['title']).toBe(title);
});

When('I send a PATCH request to update product with ID {int} with price {int}', async function (this: CustomWorld, id: number, price: number) {
  const data = await this.productApiClient.patchProduct(id, { price });
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response product price should be {int}', async function (this: CustomWorld, price: number) {
  expect(this.responseData['price']).toBe(price);
});

When('I send a DELETE request for product with ID {int}', async function (this: CustomWorld, id: number) {
  const data = await this.productApiClient.deleteProduct(id);
  this.responseData = data as unknown as Record<string, unknown>;
  this.responseStatus = 200;
});

Then('the response should confirm the product is deleted', async function (this: CustomWorld) {
  expect(this.responseData).toHaveProperty('isDeleted', true);
});
