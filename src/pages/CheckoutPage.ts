import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Step One
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step Two
  readonly finishButton: Locator;
  readonly summaryTotal: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryItems: Locator;

  // Complete
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryTotal = page.locator('.summary_total_label');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryItems = page.locator('.cart_item');
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return (await this.errorMessage.textContent()) || '';
  }

  async getOrderTotal(): Promise<string> {
    return (await this.summaryTotal.textContent()) || '';
  }

  async getOrderSubtotal(): Promise<string> {
    return (await this.summarySubtotal.textContent()) || '';
  }

  async getConfirmationMessage(): Promise<string> {
    await this.waitForElement(this.confirmationHeader);
    return (await this.confirmationHeader.textContent()) || '';
  }

  async isOrderComplete(): Promise<boolean> {
    return this.confirmationHeader.isVisible();
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  async completeCheckout(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillCustomerInfo(firstName, lastName, postalCode);
    await this.clickContinue();
    await this.clickFinish();
  }
}
