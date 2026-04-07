import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';

Then('I should see at least {int} product on the page', async function (this: CustomWorld, count: number) {
  const productCount = await this.inventoryPage.getProductCount();
  expect(productCount).toBeGreaterThanOrEqual(count);
});

When('I add {string} to the cart', async function (this: CustomWorld, productName: string) {
  await this.inventoryPage.addProductToCartByName(productName);
});

Given('I have added {string} to the cart', async function (this: CustomWorld, productName: string) {
  await this.inventoryPage.addProductToCartByName(productName);
});

When('I remove {string} from the cart on the inventory page', async function (this: CustomWorld, productName: string) {
  await this.inventoryPage.removeProductFromCartByName(productName);
});

Then('the cart badge should show {string}', async function (this: CustomWorld, count: string) {
  const badgeCount = await this.inventoryPage.getCartBadgeCount();
  expect(badgeCount.toString()).toBe(count);
});

Then('the cart badge should not be visible', async function (this: CustomWorld) {
  const badge = this.page.locator('.shopping_cart_badge');
  await expect(badge).not.toBeVisible();
});

When('I sort products by {string}', async function (this: CustomWorld, sortOption: string) {
  await this.inventoryPage.sortProductsBy(sortOption);
});

Then('the products should be sorted by price ascending', async function (this: CustomWorld) {
  const prices = await this.inventoryPage.getProductPrices();
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});

Then('the products should be sorted by name descending', async function (this: CustomWorld) {
  const names = await this.inventoryPage.getProductNames();
  const sorted = [...names].sort((a, b) => b.localeCompare(a));
  expect(names).toEqual(sorted);
});

When('I click on the shopping cart', async function (this: CustomWorld) {
  await this.inventoryPage.clickShoppingCart();
});

Then('I should be on the cart page', async function (this: CustomWorld) {
  await this.loginPage.assertUrl('cart');
  const isOnCart = await this.cartPage.isOnCartPage();
  expect(isOnCart).toBe(true);
});

Given('I navigate to the cart page', async function (this: CustomWorld) {
  await this.inventoryPage.clickShoppingCart();
  await this.cartPage.isOnCartPage();
});
