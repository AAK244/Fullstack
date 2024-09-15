import { test, expect } from '@playwright/test';

test.describe('When logged in', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('http://localhost:5173');

    await page.waitForSelector('input[type="text"]');

    await page.fill('input[type="text"]', 'mluukkai');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Matti Luukkainen logged in')).toBeVisible();
  });

  test('a new blog can be created', async ({ page }) => {
    await page.click('text=Create New Blog');

    const inputs = await page.$$('input[type="text"]');
    await inputs[0].fill('My Test Blog'); 
    await inputs[1].fill('Test Author'); 
    await inputs[2].fill('https://testblog.com');

    await page.click('button[type="submit"]');

    const blogListItem = page.locator('div').filter({ hasText: 'My Test Blog Test Author view' }).first();
    await expect(blogListItem).toBeVisible();
  });
});
