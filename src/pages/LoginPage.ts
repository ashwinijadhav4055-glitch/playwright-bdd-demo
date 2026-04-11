import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginLogo = page.locator('.login_logo');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return (await this.errorMessage.textContent()) || '';
  }

  async isLoginPageVisible(): Promise<boolean> {
    return this.loginLogo.isVisible();
  }

  async loginWithEnvCredentials(): Promise<void> {
    const username = process.env.UI_USERNAME || 'standard_user';
    const password = process.env.UI_PASSWORD || 'secret_sauce';
    await this.login(username, password);
    console.log('login successfully');
  }
}
