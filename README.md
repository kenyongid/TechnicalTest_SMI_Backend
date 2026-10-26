# ProductHub

ProductHub adalah aplikasi katalog dan manajemen produk sederhana yang dibuat sebagai bagian dari coding test **Front-End Engineer** dan **Back-End Engineer** di SMI.

Aplikasi ini menampilkan katalog produk dari [DummyJSON](https://dummyjson.com) dan juga punya halaman kelola produk sendiri yang terhubung ke backend Laravel. Semua fitur katalog bisa langsung jalan tanpa perlu menyalakan backend.

---

## Fitur

- **Login** — halaman login dengan validasi frontend dan backend. Kalau backend tidak jalan, ada fallback ke akun demo lokal supaya tampilan tetap bisa dicoba.
- **Katalog Produk** — mengambil data dari DummyJSON, lengkap dengan pencarian, filter kategori, paginasi, dan modal detail produk.
- **Kelola Produk** — halaman CRUD produk yang terhubung ke Laravel backend. Bisa tambah, edit, hapus produk, plus lihat statistik ringkas (total, tersedia, habis stok, rata-rata harga).
- **Proteksi Route** — halaman dashboard dan manage hanya bisa diakses setelah login.

---

## Teknologi

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | 19 | Library UI utama |
| Vite | 8 | Build tool dan dev server |
| React Router DOM | 7 | Routing antar halaman |
| CSS + CSS Variables | — | Styling dari nol, tanpa framework |
| Fetch API | bawaan browser | Komunikasi HTTP ke API |
| ESLint | 9 | Menjaga kualitas kode |

### Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| PHP | 8.1 | Bahasa pemrograman |
| Laravel | 10 | Framework backend |
| Laravel Sanctum | 3.3 | Autentikasi berbasis token |
| MySQL | 8 | Database produk dan pengguna |
| PHPUnit | 10 | Unit testing endpoint API |

---

## Cara Menjalankan — Frontend

Cukup butuh Node.js. Backend tidak wajib untuk mencoba katalog produk.

```bash
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

**Akun demo:**
- Email: `demo@producthub.test`
- Password: `Demo@1234`

---

## Cara Menjalankan — Backend

Pastikan sudah punya PHP 8.1, Composer 2, dan MySQL yang berjalan.

```bash
# Masuk ke folder backend
cd backend

# Install dependency PHP
composer install

# Salin dan sesuaikan file environment
cp .env.example .env
# Buka .env, isi DB_PASSWORD sesuai password MySQL kamu

# Generate app key Laravel
php artisan key:generate

# Buat database di MySQL
mysql -u root -e "CREATE DATABASE producthub;"

# Jalankan migration dan isi data awal (50 produk dummy sudah disiapkan)
php artisan migrate --seed

# Jalankan server backend
php artisan serve
```

Backend akan berjalan di [http://localhost:8000](http://localhost:8000). Frontend secara otomatis akan mendeteksi backend dan menggunakannya untuk login dan manajemen produk.

---

## Cara Menjalankan Test

Pastikan MySQL berjalan, lalu buat database khusus untuk test:

```bash
mysql -u root -e "CREATE DATABASE producthub_test;"
cd backend
php artisan test
```

Ada 13 test case yang mencakup login, proteksi endpoint, operasi CRUD produk, pencarian, filter ketersediaan, dan endpoint statistik.

---

## Catatan

- Token autentikasi disimpan di memory React, bukan di `localStorage`. Artinya kalau halaman di-refresh, pengguna perlu login ulang — ini disengaja.
- Seeder backend menggunakan data statis sehingga tidak butuh koneksi internet saat setup.
- Halaman **Kelola Produk** menampilkan pesan informatif jika backend tidak aktif, dan bisa langsung dicoba ulang tanpa refresh halaman.
