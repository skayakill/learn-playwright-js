const {test, expect, locator} = require('@playwright/test');

test('locatorOperators', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByRole("textbox").and(page.getByPlaceholder('Username')).fill('standard_user');
    // await page.getByPlaceholder('Username').fill('standard_user');
    // await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole("textbox").and(page.getByPlaceholder('Password')).fill('secret_sauce');
    await page.getByRole('button').click();

    const productItems = page.locator("xpath=//*[@class='inventory_item']");

    await expect(productItems).toHaveCount(6);
});