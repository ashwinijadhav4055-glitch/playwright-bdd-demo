import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, APIRequestContext, chromium, request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { AuthApiClient } from '../api/AuthApiClient';
import { ProductApiClient } from '../api/ProductApiClient';
import { UserApiClient } from '../api/UserApiClient';
import dotenv from 'dotenv';

dotenv.config();

export interface CustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  apiContext: APIRequestContext;

  // Pages
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;

  // API Clients
  authApiClient: AuthApiClient;
  productApiClient: ProductApiClient;
  userApiClient: UserApiClient;

  // Shared State
  authToken: string;
  responseData: Record<string, unknown>;
  responseStatus: number;

  // Methods
  initBrowser(): Promise<void>;
  initApiContext(): Promise<void>;
  closeBrowser(): Promise<void>;
  closeApiContext(): Promise<void>;
}

class PlaywrightWorld extends World implements CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  apiContext!: APIRequestContext;

  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutPage!: CheckoutPage;

  authApiClient!: AuthApiClient;
  productApiClient!: ProductApiClient;
  userApiClient!: UserApiClient;

  authToken: string = '';
  responseData: Record<string, unknown> = {};
  responseStatus: number = 0;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    this.context = await this.browser.newContext({
      baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });
    this.page = await this.context.newPage();

    this.loginPage = new LoginPage(this.page);
    this.inventoryPage = new InventoryPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
  }

  async initApiContext(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://dummyjson.com',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });

    this.authApiClient = new AuthApiClient(this.apiContext);
    this.productApiClient = new ProductApiClient(this.apiContext);
    this.userApiClient = new UserApiClient(this.apiContext);
  }

  async closeBrowser(): Promise<void> {
    if (this.page && !this.page.isClosed()) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  async closeApiContext(): Promise<void> {
    if (this.apiContext) await this.apiContext.dispose();
  }
}

setWorldConstructor(PlaywrightWorld);