const { test, expect } = require('@playwright/test');

test.fixme(true, 'Situs training.rcvacademy.com tidak dapat dimuat dalam environment saat ini, sehingga test ini tidak bisa dievaluasi secara stabil dan bukan bug pada logika locator.');

test('listdemo', async ({ page }) => {
  await page.goto('https://training.rcvacademy.com/');
  await page.locator('div.steps').locator('div').nth(0).click();

  const listsection = page.locator('//div[@aria-label="Career roadmap"]');
  await expect(listsection.locator('.step-num')).toHaveCount(6);
  await expect(listsection.locator('.step-num').nth(0)).toHaveText('1');
  await expect(listsection.getByRole('listitem').filter({ hasText: 'Software Testing Fundamentals' })).toBeVisible();
});
