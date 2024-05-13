import { test, expect } from '@playwright/test';

test('UC1.04', async ({ page }) => {
await page.goto('http://localhost:90/login');
await page.getByLabel('Email').click();
await page.getByLabel('Email').fill('georgina@armydemo.com');
await page.getByLabel('Email').press('Tab');
await page.getByLabel('Password').fill('Testing55@');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByText('HomeRouteCreateSpecsVehiclesEmissions CalculatorSign OutGet Support Here.')).toBeVisible();
});