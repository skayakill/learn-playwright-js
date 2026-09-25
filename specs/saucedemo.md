# SauceDemo Test Plan

## Tujuan
Menguji alur utama aplikasi SauceDemo menggunakan akun demo yang tersedia:
- standard_user / secret_sauce
- locked_out_user / secret_sauce

## Lingkup pengujian
1. Login valid dan invalid
2. Manajemen produk di keranjang
3. Checkout dengan data valid dan invalid
4. Logout dari aplikasi

## Persiapan
- Base URL: https://www.saucedemo.com/
- Browser: Chromium / Firefox / WebKit sesuai konfigurasi Playwright
- Login yang akan digunakan:
  - standard_user / secret_sauce
  - locked_out_user / secret_sauce
  - password salah: standard_user / wrong_password
  - field kosong: tidak mengisi username dan/atau password

## Scenario detail

### 1. Login berhasil
- Masuk ke halaman login
- Isi username dengan standard_user
- Isi password dengan secret_sauce
- Klik tombol Login
- Verifikasi halaman inventory muncul
- Verifikasi judul halaman menampilkan `Products`
- Verifikasi user diarahkan ke inventory list

### 2. Login dengan password salah
- Isi username standard_user
- Isi password dengan nilai tidak valid, misalnya `wrong_password`
- Klik Login
- Verifikasi pesan error tampil: `Username and password do not match any user in this service`
- Verifikasi user tetap berada di halaman login

### 3. Login dengan field kosong
- Kosongkan username dan password
- Klik Login
- Verifikasi pesan error tampil sesuai validasi form
- Verifikasi user tetap di halaman login

### 4. Login user terkunci
- Isi username locked_out_user
- Isi password secret_sauce
- Klik Login
- Verifikasi pesan error tampil: `Sorry, this user has been locked out.`
- Verifikasi user tidak masuk ke inventory

### 5. Menambah produk ke keranjang
- Login berhasil sebagai standard_user
- Klik tombol Add to cart untuk produk, misalnya `Sauce Labs Backpack`
- Verifikasi badge keranjang bertambah menjadi 1
- Verifikasi tombol berubah menjadi `Remove`

### 6. Menghapus produk dari keranjang
- Login berhasil
- Tambahkan satu produk ke keranjang
- Klik Remove pada produk yang sama
- Verifikasi cart badge hilang atau bernilai 0
- Verifikasi produk tidak lagi ada di keranjang

### 7. Checkout dengan data lengkap
- Login berhasil
- Tambahkan produk ke keranjang
- Klik cart icon
- Klik Checkout
- Isi First Name, Last Name, dan Postal Code dengan data valid
- Klik Continue
- Verifikasi halaman review checkout muncul
- Klik Finish
- Verifikasi halaman konfirmasi checkout tampil: `Thank you for your order!`

### 8. Checkout dengan first name kosong
- Login berhasil
- Tambahkan produk ke keranjang
- Klik cart icon
- Klik Checkout
- Kosongkan First Name
- Isi Last Name dan Postal Code
- Klik Continue
- Verifikasi error validasi form tampil
- Verifikasi user tidak bisa melanjutkan ke halaman review

### 9. Logout
- Login berhasil
- Klik icon menu (hamburger)
- Klik tombol Logout
- Verifikasi user kembali ke halaman login
- Verifikasi form login terlihat kembali

## Expected Result
Semua skenario di atas harus sesuai dengan behavior aplikasi dan tampilkan pesan error yang benar saat validasi gagal.

## Catatan implementasi test
- Gunakan locator yang stabil seperti `getByRole`, `getByText`, dan `getByPlaceholder` untuk mengurangi flakiness.
- Hindari hardcoded selector yang terlalu spesifik jika elemen memiliki label yang jelas.
- Prioritaskan assertion yang menilai behavior nyata pengguna, misalnya URL, pesan error, tombol berubah, dan badge keranjang.
