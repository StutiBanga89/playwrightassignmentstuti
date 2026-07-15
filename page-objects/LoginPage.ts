import { expect, type Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameField;
  private readonly passwordField;
  private readonly loginButton;
  private readonly dashboardHeading;
  private readonly InvalidLoginMessage;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.dashboardHeading = page.locator('h6', { hasText: 'Dashboard' });
    this.InvalidLoginMessage = page.getByText('Invalid credentials');
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async expectDashboardVisible(): Promise<void> {
    await expect(this.dashboardHeading).toBeVisible();
  }

  async expectInvalidLoginVisible(): Promise<void> {
    await expect(this.InvalidLoginMessage).toBeVisible();
  }
}
