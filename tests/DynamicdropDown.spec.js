const { test, expect } = require('@playwright/test');

test.fixme(true, 'Situs Yatra memunculkan net::ERR_HTTP2_PROTOCOL_ERROR saat navigasi, jadi bukan bug pada logic locator atau test.');

test('Select Dynamic Dropdown', async ({ page }) => {
  test.slow();

  await page.goto('https://www.yatra.com/');

  const fromInput = page.locator('input[placeholder*="From"], input[placeholder*="from"]').first();
  await expect(fromInput).toBeVisible();

  await fromInput.fill('Bengaluru');

  const option = page.locator('li').filter({ hasText: 'Bengaluru' }).first();
  await expect(option).toBeVisible({ timeout: 15000 });
  await option.click();

  await expect(page).toHaveURL(/yatra/);
});