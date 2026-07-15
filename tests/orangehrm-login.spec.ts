import { test } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { loginData } from '../test-data/loginData';

let loginPage: LoginPage;

test.describe('OrangeHRM login functionality', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(loginData.url);
  });

  test('Successful login to OrangeHRM demo', async () => {
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.expectDashboardVisible();
  });

  test('Failed login to OrangeHRM demo', async () => {
    await loginPage.login(loginData.invalid_user, loginData.invalid_password);
    await loginPage.expectInvalidLoginVisible();
  });


  
});