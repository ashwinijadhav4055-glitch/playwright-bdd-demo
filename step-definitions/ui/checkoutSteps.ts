import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';

When('I click on checkout', async function (this: CustomWorld) {
  await this.cartPage.clickCheckout();
});

When('I fill in first name {string} last name {string} and postal code {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.checkoutPage.fillCustomerInfo(firstName, lastName, postalCode);
  });

When('I click continue on checkout step one', async function (this: CustomWorld) {
  await this.checkoutPage.clickContinue();
});

When('I click finish', async function (this: CustomWorld) {
  await this.checkoutPage.clickFinish();
});

When('I click cancel on checkout', async function (this: CustomWorld) {
  await this.checkoutPage.clickCancel();
});

Then('I should see the order summary', async function (this: CustomWorld) {
  const finishButton = this.page.locator('[data-test="finish"]');
  await expect(finishButton).toBeVisible();
});

Then('the order total should be displayed', async function (this: CustomWorld) {
  const total = await this.checkoutPage.getOrderTotal();
  expect(total).toBeTruthy();
  expect(total).toContain('Total');
});

Then('I should see the order confirmation message {string}', async function (this: CustomWorld, message: string) {
  const confirmation = await this.checkoutPage.getConfirmationMessage();
  expect(confirmation).toContain(message);
});

Then('I should see a checkout error {string}', async function (this: CustomWorld, errorMsg: string) {
  const error = await this.checkoutPage.getErrorMessage();
  expect(error).toContain(errorMsg);
});
