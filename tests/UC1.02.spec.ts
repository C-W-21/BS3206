import { test, expect } from '@playwright/test';

test('UC1.02', async ({ page }) => {
  await page.goto('http://localhost:90/login');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('Testing55@');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form')).toContainText('Username should not be empty');
  await expect(page.getByRole('paragraph')).toContainText('An error occurred during login');
});