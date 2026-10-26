# ProductHub

Aplikasi katalog produk yang dibuat untuk coding test **Front-End Engineer** di SMI.

Idenya sederhana: pengguna login dulu, lalu bisa menjelajahi ratusan produk dari berbagai kategori — bisa dicari, difilter, dan dilihat detailnya.

---

## Coba langsung

Cukup jalankan satu perintah, tidak perlu setup database atau backend.

```bash
git clone <url-repo>
cd producthub
npm install
npm run dev
```

Buka **http://localhost:5173**, lalu login dengan:

| | |
|---|---|
| Email | `demo@producthub.test` |
| Password | `Demo@1234` |

---

## Apa saja yang bisa dilakukan

- **Login** — ada validasi di frontend, pesan error yang jelas, dan loading state saat proses masuk
- **Katalog produk** — grid responsif, 20 produk per halaman, diambil langsung dari DummyJSON
- **Cari produk** — ketik nama produk, hasil muncul otomatis (debounced, tidak spam request)
- **Filter kategori** — pilih dari daftar kategori nyata yang diambil dari API
- **Detail produk** — klik kartu mana saja untuk lihat modal dengan gambar besar, deskripsi, rating, dan info stok
- **Paginasi** — navigasi antar halaman dengan smooth scroll ke atas
- **Logout** — keluar dari sesi, kembali ke halaman login

---

## Tumpukan teknologi

| Teknologi | Untuk apa |
|---|---|
| React 19 | Framework utama |
| Vite 8 | Build tool — cepat, ringan |
| React Router DOM | Routing SPA (login / dashboard / 404) |
| CSS + CSS Variables | Styling dari nol, tanpa UI framework |
| Fetch API | HTTP request ke DummyJSON, bawaan browser |
| ESLint | Menjaga konsistensi kode |

Sengaja tidak pakai Axios, Redux, atau UI library besar — bukan karena tidak tahu, tapi memang tidak diperlukan untuk skala aplikasi ini.

---

## Struktur folder

```
producthub/
├── backend/              ← Laravel backend (opsional, lihat bawah)
├── src/
│   ├── components/       ← Komponen UI yang bisa dipakai ulang
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchBar.jsx
│   │   └── StatusMessage.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx   ← State login global (token, user, login, logout)
│   ├── hooks/
│   │   └── useProducts.js    ← Semua logika fetch produk ada di sini
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   ├── apiClient.js      ← Wrapper Fetch API
│   │   ├── authService.js    ← Fungsi login dan logout
│   │   └── productService.js ← Semua panggilan ke DummyJSON
│   └── utils/
│       └── formatCurrency.js ← Format harga ke USD
```

### Kenapa dipisah seperti ini?

Karena satu komponen seharusnya punya satu tanggung jawab. `ProductCard` tidak perlu tahu cara memanggil API. `DashboardPage` tidak perlu tahu bagaimana format harga. Kalau nanti ada yang harus diubah, tinggal cari di tempat yang tepat.

---

## Alur login

1. User isi form → validasi sederhana di frontend (field kosong, format email)
2. `authService.login()` dipanggil
3. Kalau backend Laravel tersedia di `localhost:8000` → login via API, token dari server
4. Kalau backend tidak jalan → fallback ke validasi lokal dengan akun demo
5. Token disimpan di React Context (in-memory) — sengaja tidak ke `localStorage`
6. Halaman redirect ke dashboard

Refresh halaman = logout. Ini disengaja karena brief minta jangan simpan token di localStorage.

---

## API yang dipakai dari DummyJSON

```
GET /products?limit=20&skip=N          → daftar produk + paginasi
GET /products/search?q=...             → cari produk
GET /products/categories               → daftar kategori
GET /products/category/:slug           → produk per kategori
```

Semua data yang ditampilkan berasal dari API — tidak ada data palsu yang dikarang.

---

## Backend Laravel (opsional)

Folder `backend/` berisi Laravel 10 + Sanctum untuk autentikasi nyata dengan MySQL.
Kalau mau dijalankan:

```bash
cd backend
composer install
cp .env.example .env
# Edit .env: isi DB_PASSWORD

php artisan key:generate
mysql -u root -e "CREATE DATABASE producthub;"
php artisan migrate
php artisan db:seed
php artisan serve
```

Frontend akan otomatis mendeteksi dan menggunakan backend ini kalau jalan di port 8000.

---

## Hal yang perlu diketahui

- **Token hilang saat refresh** — ini perilaku yang disengaja
- **Tidak ada registrasi** — cukup akun demo untuk keperluan demonstrasi
- **Data produk read-only** — tidak ada fitur tambah/edit/hapus
- **CORS** dikonfigurasi untuk localhost saja
