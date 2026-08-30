const {test, expect, locator} = require('@playwright/test');

test('filterDemo', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const usernameInput = page.getByPlaceholder('Username');
    const passwordInput = page.getByPlaceholder('Password');
    // Login button di Saucedemo biasanya bisa dideteksi dengan getByTestId atau CSS, 
    // jika getByRole ini gagal, alternatifnya: page.locator('[data-test="login-button"]')
    const loginButton = page.getByRole('button', { name: 'Login' }); 

    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // PERBAIKAN: Cari container '.inventory_item' yang memiliki teks spesifik, lalu klik tombol di dalamnya
    await page.locator('.inventory_item')
        .filter({ hasText: 'Sauce Labs Backpack' })
        .getByRole('button', { name: 'Add to cart' })
        .click();
});

test('selecItems', async ({ page }) => {
     await page.goto('https://www.saucedemo.com/');

    const usernameInput = page.getByPlaceholder('Username');
    const passwordInput = page.getByPlaceholder('Password');
    // Login button di Saucedemo biasanya bisa dideteksi dengan getByTestId atau CSS, 
    // jika getByRole ini gagal, alternatifnya: page.locator('[data-test="login-button"]')
    const loginButton = page.getByRole('button', { name: 'Login' }); 

    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await page.locator('.inventory_item')
        .filter({ has: page.getByRole('link', { name: 'Sauce Labs Bike Light' }) })
        .getByRole('button', { name: 'Add to cart' })
        .click();
});

test('detailProduct', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const usernameInput = page.getByPlaceholder('Username');
    const passwordInput = page.getByPlaceholder('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // PERBAIKAN: Hapus .isVisible dan langsung gunakan .getByRole untuk mencari link/judul produk
    await page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Fleece Jacket' })
    .locator('.inventory_item_name') // Langsung targetkan teks judulnya
    .click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=5');

    await page.locator('.inventory_details_desc_container')
        .filter({ hasText: 'Sauce Labs Fleece Jacket' }) 
        .getByRole('button', { name: 'Add to cart' }) 
        .click();
});