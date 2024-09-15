import { test, expect } from '@playwright/test';

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const loginButton = await page.locator('text=Login');
    await expect(loginButton).toBeVisible();
  });
});
