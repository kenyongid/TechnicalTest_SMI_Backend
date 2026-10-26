# ProductHub

Aplikasi katalog produk sederhana yang dibangun sebagai coding test **Front-End Engineer**.

Pengguna harus login terlebih dahulu sebelum dapat mengakses katalog produk yang diambil dari [DummyJSON API](https://dummyjson.com).

---

## Demo

| Field    | Value                  |
|----------|------------------------|
| Email    | `demo@producthub.test` |
| Password | `Demo@1234`            |

---

## Cara Menjalankan

Hanya memerlukan Node.js. **Tidak perlu backend atau database.**

```bash
# 1. Clone repository
git clone <url-repo>
cd producthub

# 2. Install dependency
npm install

# 3. Jalankan dev server
npm run dev

# 4. Buka di browser
# http://localhost:5173
```

### Build untuk production

```bash
npm run build
npm run preview
```

---

## Fitur

- **Login** — validasi frontend dengan kredensial dummy, loading state, error messages
- **Katalog Produk** — grid responsif dari DummyJSON API (20 produk per halaman)
- **Pencarian** — debounced real-time search via endpoint DummyJSON
- **Filter Kategori** — berdasarkan kategori nyata dari API
- **Paginasi** — navigasi halaman yang konsisten
- **Detail Produk** — modal dengan gambar, deskripsi, rating, stok
- **Loading / Error / Empty State** — semua kondisi ditangani dengan baik
- **Image Fallback** — gambar gagal load ditangani dengan placeholder
- **Logout** — membersihkan session

---

## Teknologi & Tools

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| React.js | 19 | Framework utama sesuai requirement |
| Vite | 8 | Build tool yang cepat, konfigurasi minimal |
| React Router DOM | 7 | Routing SPA (login → dashboard → 404) |
| CSS + CSS Variables | — | Kontrol penuh tanpa framework tambahan |
| Fetch API | bawaan | Tidak perlu library HTTP tambahan |
| ESLint | 10 | Menjaga kualitas dan konsistensi kode |

---

## Arsitektur & Struktur Folder

```
src/
├── components/          # Komponen UI yang dapat digunakan kembali
│   ├── Navbar.jsx       # Header + tombol logout
│   ├── ProductCard.jsx  # Kartu satu produk
│   ├── ProductGrid.jsx  # Grid daftar produk
│   ├── ProductModal.jsx # Modal detail produk
│   ├── ProtectedRoute.jsx # Guard untuk halaman terproteksi
│   ├── SearchBar.jsx    # Input pencarian dengan debounce
│   └── StatusMessage.jsx # Loading / error / empty state
│
├── contexts/
│   └── AuthContext.jsx  # State autentikasi global (token, user, login, logout)
│
├── hooks/
│   └── useProducts.js   # Logika fetch produk (state, pagination, filter, search)
│
├── layouts/
│   └── DashboardLayout.jsx # Wrapper Navbar + konten
│
├── pages/
│   ├── LoginPage.jsx    # Halaman login
│   ├── DashboardPage.jsx # Halaman katalog produk
│   └── NotFoundPage.jsx # Halaman 404
│
├── services/
│   ├── apiClient.js     # HTTP client berbasis Fetch API
│   ├── authService.js   # Fungsi login / logout
│   └── productService.js # Fungsi fetch data dari DummyJSON
│
└── utils/
    └── formatCurrency.js # Format harga ke USD
```

### Prinsip Pemisahan Tanggung Jawab

- **Components** → hanya menangani tampilan dan interaksi
- **Pages** → menyusun komponen menjadi halaman lengkap
- **Services** → semua komunikasi dengan API (tidak ada `fetch` di komponen)
- **Hooks** → logika stateful yang bisa digunakan kembali
- **Utils** → fungsi murni tanpa side effect

---

## Alur Login

1. User memasukkan email + password → validasi format di frontend
2. `authService.login()` dipanggil
3. Token disimpan di React Context (in-memory, tidak ke localStorage)
4. React Router redirect ke dashboard

> **Catatan keamanan:** Token tidak disimpan di `localStorage` untuk menghindari risiko XSS.

---

## API DummyJSON yang Digunakan

| Endpoint | Kegunaan |
|----------|----------|
| `GET /products?limit=20&skip=N` | Daftar produk dengan paginasi |
| `GET /products/search?q=query` | Pencarian produk |
| `GET /products/categories` | Daftar kategori |
| `GET /products/category/:slug` | Produk per kategori |

---

## Environment Variable

```env
# producthub/.env
VITE_API_BASE_URL=http://localhost:8000
```

File `.env` ini hanya diperlukan jika menggunakan backend opsional (lihat di bawah).
Tanpa backend, aplikasi tetap berjalan dengan dummy authentication.

---

## Backend Opsional (Laravel)

Backend Laravel tersedia di folder `producthub-backend/` sebagai pengembangan tambahan.
Menyediakan autentikasi nyata via MySQL + Laravel Sanctum.

Lihat `producthub-backend/README.md` untuk instruksi setup.
Login akan otomatis menggunakan backend jika tersedia di `http://localhost:8000`.

---

## Keterbatasan

- Token hilang saat refresh halaman (disengaja — tidak disimpan di localStorage)
- Data produk hanya-baca dari DummyJSON (tidak ada CRUD)
- Tidak ada registrasi; hanya akun demo
