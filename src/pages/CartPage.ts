import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async isOnCartPage(): Promise<boolean> {
    await this.waitForElement(this.cartList);
    return this.cartList.isVisible();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async removeItemByName(itemName: string): Promise<void> {
    const item = this.page.locator('.cart_item').filter({ hasText: itemName });
    await item.locator('button[data-test^="remove"]').click();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getItemPrice(itemName: string): Promise<number> {
    const item = this.page.locator('.cart_item').filter({ hasText: itemName });
    const priceText = await item.locator('.inventory_item_price').textContent();
    return parseFloat((priceText || '0').replace('$', ''));
  }
}
