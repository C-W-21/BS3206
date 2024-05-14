import { test, expect } from '@playwright/test';

test('UC1.08', async ({ page }) => {
  await page.goto('http://localhost:90/');
  await expect(page.locator('div').filter({ hasText: 'LoginEmailEmailPasswordPasswordLoginSign Up' }).first()).toBeVisible();
});