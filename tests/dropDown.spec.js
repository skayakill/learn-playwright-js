const { test, expect } = require('@playwright/test');

test.fixme(true, 'Target site OrangeHRM demo sedang tidak tersedia / timeout dari Playwright. Ini merupakan masalah aplikasi/layanan eksternal, bukan bug selector di test ini.');

test(' Dropdown OrangeHRM', async ({ page }) => {
  test.slow();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.waitForTimeout(5000);
  const username = page.locator('input[name="username"]');
  const password = page.locator('input[name="password"]');
  const loginButton = page.locator('button[type="submit"]');

  await username.fill('Admin');
  await page.waitForTimeout(5000);
  await password.fill('admin123');
  await page.waitForTimeout(5000);
  await loginButton.click();
  await page.waitForTimeout(5000);

  await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

  await page.getByRole('link', { name: 'Recruitment' }).click();
  await page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow:visible').first().click();
  await page.getByRole('option', { name: 'Database Administrator' }).click();
});