import { test, expect } from '@playwright/test';

test('UC1.05', async ({ page }) => {
await page.goto('http://localhost:90/login');
await page.getByLabel('Email').click();
await page.getByLabel('Email').fill('georgina');
await page.getByLabel('Email').press('Tab');
await page.getByLabel('Password').fill('Testing55@');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByRole('paragraph')).toContainText('Username, Password, or both are incorrect');
});