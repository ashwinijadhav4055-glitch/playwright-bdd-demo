import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';

Given('I am on the login page', async function (this: CustomWorld) {
  await this.loginPage.goto();
  const isVisible = await this.loginPage.isLoginPageVisible();
  expect(isVisible).toBe(true);
});

Given('I am logged in as {string}', async function (this: CustomWorld, username: string) {
  await this.loginPage.goto();
  const password = 'secret_sauce';
  await this.loginPage.login(username, password);
  const isOnInventory = await this.inventoryPage.isOnInventoryPage();
  expect(isOnInventory).toBe(true);
});

When('I enter username {string} and password {string}', async function (this: CustomWorld, username: string, password: string) {
  await this.loginPage.enterUsername(username);
  await this.loginPage.enterPassword(password);
});

When('I click the login button', async function (this: CustomWorld) {
  await this.loginPage.clickLoginButton();
});

Then('I should be redirected to the inventory page', async function (this: CustomWorld) {
  await this.loginPage.assertUrl('inventory');
  const isOnInventory = await this.inventoryPage.isOnInventoryPage();
  expect(isOnInventory).toBe(true);
});

Then('the page title should be {string}', async function (this: CustomWorld, title: string) {
  const pageTitle = this.page.locator('.title');
  await expect(pageTitle).toHaveText(title);
});

Then('I should see an error message {string}', async function (this: CustomWorld, errorMsg: string) {
  const message = await this.loginPage.getErrorMessage();
  expect(message).toContain(errorMsg);
});
