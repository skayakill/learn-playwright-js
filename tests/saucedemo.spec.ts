import { test, expect } from '@playwright/test';

async function login( page, username: string, password: string) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/\/inventory\.html$/);
}

test.describe('SauceDemo', () => {
  test('login success with valid credentials', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('login with wrong password shows error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText(/username and password do not match any user in this service/i)).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('login with empty fields shows validation error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText(/username is required|password is required/i)).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('login with locked out user shows error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText(/sorry, this user has been locked out/i)).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('add and remove product from cart', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.getByRole('button', { name: /remove/i }).first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('checkout with complete data succeeds', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: /checkout/i }).click();

    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder(/zip|postal/i).fill('12345');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    await page.getByRole('button', { name: /finish/i }).click();
    await expect(page.getByText(/thank you for your order/i)).toBeVisible();
  });

  test('checkout with empty first name shows validation error', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: /checkout/i }).click();

    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder(/zip|postal/i).fill('12345');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.getByText(/first name is required/i)).toBeVisible();
  });

  test('logout returns to login page', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('button', { name: /logout/i }).click();

    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });
});
