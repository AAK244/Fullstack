import { test, expect } from '@playwright/test';

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.delete('http://localhost:3003/api/testing/reset');

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'password'
    };

    await request.post('http://localhost:3003/api/users', { data: newUser });

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const loginButton = await page.locator('text=login');
    await expect(loginButton).toBeVisible();
  });

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[type="text"]', 'mluukkai');
      await page.fill('input[type="password"]', 'password');
      await page.click('text=login');

      await expect(page.locator(`text=Matti Luukkainen logged in`)).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[type="text"]', 'mluukkai');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('text=login');

      await expect(page.locator('text=wrong username or password')).toBeVisible();
      await expect(page.locator('text=login')).toBeVisible();
    });
  });
});
