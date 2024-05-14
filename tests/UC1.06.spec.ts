import { test, expect } from '@playwright/test';

test('UC1.06', async ({ page }) => {
  await page.goto('http://localhost:90/login');
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('georgina@armydemo.com');
  await page.getByLabel('Email').press('Tab');
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('paragraph')).toContainText('Username, Password, or both are incorrect');
});