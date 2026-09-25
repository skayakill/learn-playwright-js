const { test, expect } = require('@playwright/test');

async function login(page) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
}

test('filterDemo', async ({ page }) => {
  await login(page);

  const backpackCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('selecItems', async ({ page }) => {
  await login(page);

  const bikeCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' });
  await bikeCard.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('detailProduct', async ({ page }) => {
  await login(page);

  const jacketCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Fleece Jacket' });
  await jacketCard.locator('.inventory_item_name').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=5');
  await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Fleece Jacket');

  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});