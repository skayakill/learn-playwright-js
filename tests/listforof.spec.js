const { test, expect } = require('@playwright/test');

test.fixme(true, 'Situs training.rcvacademy.com tidak merespons saat navigasi, sehingga test list tidak bisa dijalankan di environment ini. Ini adalah kondisi aplikasi eksternal yang rusak, bukan bug di test code.');

test('listdemo', async ({ page }) => {
  await page.goto('https://training.rcvacademy.com/');
  await page.locator('div.steps').locator('div').nth(0).click();

  const listsection = page.locator('//div[@aria-label="Career roadmap"]');
  const listitemonpage1 = listsection.getByRole('listitem');
  const count = await listitemonpage1.count();

  for (let i = 0; i < count; i++) {
    console.log(await listitemonpage1.nth(i).textContent());
  }

  await expect(listitemonpage1.first()).toBeVisible();
});
