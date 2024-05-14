import { test, expect } from '@playwright/test';

test('UC1.07', async ({ page }) => {
  await page.goto('http://localhost:90/login');
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('test');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('paragraph')).toContainText('Username, Password, or both are incorrect');
});