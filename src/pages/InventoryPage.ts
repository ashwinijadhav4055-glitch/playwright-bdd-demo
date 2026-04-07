import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async isOnInventoryPage(): Promise<boolean> {
    await this.waitForElement(this.inventoryList);
    return this.inventoryList.isVisible();
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addProductToCartByName(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    const addButton = product.locator('button[data-test^="add-to-cart"]');
    await addButton.click();
  }

  async removeProductFromCartByName(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    const removeButton = product.locator('button[data-test^="remove"]');
    await removeButton.click();
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = await this.shoppingCartBadge.textContent();
    return badge ? parseInt(badge) : 0;
  }

  async clickShoppingCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async sortProductsBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async logout(): Promise<void> {
    await this.burgerMenu.click();
    await this.page.waitForSelector('#logout_sidebar_link');
    await this.logoutLink.click();
  }
}
