import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:90/login');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form')).toContainText('Username should not be empty');
  await expect(page.locator('form')).toContainText('Password should not be empty');
});