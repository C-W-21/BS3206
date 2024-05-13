import { test, expect } from '@playwright/test';

test('UC1.03', async ({ page }) => {
  await page.goto('http://localhost:90/login');
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('georgina@armydemo.com');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('form')).toContainText('Password should not be empty');
  await expect(page.getByRole('paragraph')).toContainText('Password, Username or both are incorrect');
});