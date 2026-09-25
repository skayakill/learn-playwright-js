const { test, expect } = require('@playwright/test');

// Script ini digunakan untuk menguji flow bisnis aplikasi SauceDemo secara otomatis.
// Fungsi utamanya adalah memvalidasi bahwa user bisa login, melihat produk,
// melakukan pengecekan kondisi keranjang, serta memastikan filter harga bekerja sesuai aturan.
// Secara umum, script ini dipakai untuk testing end-to-end (E2E) pada UI aplikasi,
// bukan hanya untuk menguji satu tombol saja. Ia bertujuan memastikan fitur berjalan sesuai business logic.

// Fungsi login ini dipakai sebagai setup awal untuk semua test.
// Tujuannya adalah memastikan user sudah berhasil login ke aplikasi SauceDemo
// sebelum masuk ke halaman inventory dan menjalankan skenario checkout.
async function login(page) {
  // Buka halaman login aplikasi.
  await page.goto('https://www.saucedemo.com/');

  // Masukkan kredensial valid agar test masuk ke halaman produk.
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Validasi bahwa login berhasil dan user diarahkan ke inventory page.
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
}

// Script ini fungsinya untuk menguji aturan bisnis checkout kondisional:
// - Jika keranjang memiliki item, user boleh lanjut ke cart dan checkout.
// - Jika keranjang kosong, tombol checkout tidak boleh muncul.
// Dengan kata lain, ini adalah test untuk validasi guard condition pada workflow checkout.
test('checkout kondisional', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await login(page);

  // Cek jumlah item di cart melalui badge di header.
  // Jika badge ada, artinya ada item di keranjang.
  const badge = page.locator('.shopping_cart_badge');
  const count = (await badge.count()) > 0
    ? parseInt(await badge.innerText())
    : 0;

  if (count > 0) {
    // Positive flow / happy path.
    // Keranjang berisi item, maka user diperbolehkan masuk ke halaman cart.
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
  } else {
    // Negative flow / guard condition.
    // Keranjang kosong, maka tombol checkout harus tidak ada.
    await expect(page.getByTestId('checkout')).toHaveCount(0);
  }
});

// Scenario negative tambahan: memastikan checkout tidak tersedia saat cart kosong.
// Ini berguna untuk memverifikasi business rule dan mencegah user lanjut ke checkout
// tanpa ada produk yang dipilih.
test('negative: checkout tidak muncul saat keranjang kosong', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await login(page);

  // Pastikan cart masih kosong.
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

  // Karena tidak ada item, tombol checkout seharusnya tidak ada.
  await expect(page.getByTestId('checkout')).toHaveCount(0);
});

// Helper ini fungsinya untuk menguji login dengan berbagai jenis user.
// Digunakan untuk skenario positif (user valid) dan negative (user terkunci).
// Karena ini adalah reusable function, maka harus dipanggil dari test agar bisa berjalan.
async function loginDanVerifikasi(page, user, pass) {
  // Buka halaman login setiap kali helper dipanggil.
  await page.goto('https://www.saucedemo.com/');

  // Ambil elemen form login.
  const usernameField = page.getByPlaceholder('Username');
  const passwordField = page.getByPlaceholder('Password');
  const loginButton = page.getByRole('button', { name: 'Login' });

  // Isi form sesuai data user yang dikirim.
  await usernameField.fill(user);
  await passwordField.fill(pass);
  await loginButton.click();

  // Jika user adalah locked_out_user, maka login harus gagal dan muncul pesan error.
  // Di SauceDemo, error element biasanya menggunakan atribut data-test="error".
  if (user === 'locked_out_user') {
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toContainText(/locked out|this user has been locked out/i);
  } else {
    // Untuk user valid, login berhasil dan diarahkan ke halaman inventory.
    await expect(page).toHaveURL(/.*\/inventory\.html/);
  }
}

// Test ini menguji login user valid, yang merupakan skenario positif.
test('login user valid berhasil', async ({ page }) => {
  await loginDanVerifikasi(page, 'standard_user', 'secret_sauce');
});

// Test ini menguji login user yang diblokir, yang merupakan skenario negative.
test('login user terkunci gagal', async ({ page }) => {
  await loginDanVerifikasi(page, 'locked_out_user', 'secret_sauce');
});

// Helper ini berfungsi untuk memvalidasi urutan harga produk setelah user memilih filter.
// Tujuannya adalah memastikan sorting yang ditampilkan di halaman inventory benar,
// baik untuk opsi low to high maupun high to low.
async function verifikasiUrutan (page, opsi) {
    const harga = (await page.locator('.inventory_item_price').allTextContents())
    .map(harga => parseFloat(harga.replace('$', '')));
    const naik = [...harga].sort((a, b) => a - b);
    const turun = [...harga].sort((a, b) => b - a);

    if (opsi === 'lohi') expect(harga).toEqual(naik);
    else if (opsi === 'hilo') expect(harga).toEqual(turun);
    // else throw new Error('Opsi filter tidak valid. Gunakan "lohi" atau "hilo".');
}

// Test ini digunakan untuk memvalidasi fitur sorting harga dari termurah ke termahal.
test('filter harga low to high', async ({ page }) => {
  await login(page);

  await page.getByRole('combobox').selectOption('lohi');
  await verifikasiUrutan(page, 'lohi');
});

// Test ini digunakan untuk memvalidasi fitur sorting harga dari termahal ke termurah.
test('filter harga high to low', async ({ page }) => {
  await login(page);

  await page.getByRole('combobox').selectOption('hilo');
  await verifikasiUrutan(page, 'hilo');
});

// test('filter harga invalid', async ({ page }) => {
//   await login(page);
//   await page.getByRole('combobox').selectOption('invalid');
//   await verifikasiUrutan(page, 'invalid');
// });

async function urutanNamaProduk(page, opsi) {
  const namaProduk = (await page.locator('.inventory_item_name').allTextContents())
    .map(nama => nama.toLowerCase());
  const naik = [...namaProduk].sort();
  const turun = [...namaProduk].sort().reverse();

    if (opsi === 'az') expect(namaProduk).toEqual(naik);
    else if (opsi === 'za') expect(namaProduk).toEqual(turun);
}

test('filter nama produk A-Z', async ({ page }) => {
  await login(page);
    await page.getByRole('combobox').selectOption('az');
    await urutanNamaProduk(page, 'az');
});

test('filter nama produk Z-A', async ({ page }) => {
  await login(page);
    await page.getByRole('combobox').selectOption('za');
    await urutanNamaProduk(page, 'za');
});

test('validasi produk', async ({ page }) => {
  const user = 'problem_user';
  const pass = 'secret_sauce';

  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill(user);
  await page.getByPlaceholder('Password').fill(pass);
  await page.getByRole('button', { name: 'Login' }).click();

  if (user !== 'problem_user') {
    await expect(page.locator('.inventory_item_img img').first())
      .toHaveAttribute('src', /sauce-backpack/);
  }

  await expect(page.locator('.inventory_item_name').first()).not.toBeEmpty();
});

async function pastikanDiKeranjang(page, tombol) {
  await expect(tombol).toBeVisible();
  const teks = (await tombol.textContent()).trim();

  if (teks === 'Add to cart') {
    await tombol.click();
  }

  await expect(tombol).toHaveText(/Remove/i);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
}

test('pastikan produk masuk ke keranjang', async ({ page }) => {
  await login(page);
  const tombol = page.locator('.inventory_item').first().locator('button');
  await pastikanDiKeranjang(page, tombol);
});