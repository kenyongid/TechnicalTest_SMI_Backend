# ProductHub

Aplikasi katalog produk berbasis React + Laravel, dibuat untuk coding test **Front-End Engineer SMI**.

## Fitur yang Diimplementasikan

- **Login** — form dengan validasi frontend dan backend, pesan error yang jelas, loading state
- **Autentikasi** — Laravel Sanctum token API, token disimpan di React state (bukan localStorage)
- **Logout** — token dicabut di backend, state dibersihkan
- **Proteksi halaman** — dashboard hanya bisa diakses setelah login
- **Katalog produk** — grid responsif dari DummyJSON API
- **Pencarian** — debounced search via endpoint DummyJSON
- **Filter kategori** — berdasarkan kategori nyata dari API
- **Paginasi** — navigasi halaman yang konsisten
- **Detail produk** — modal dengan gambar, deskripsi, rating, stok
- **Image fallback** — gambar gagal load ditangani dengan placeholder
- **Loading / Error / Empty state** — semua kondisi ditangani

## Teknologi

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend | React 19 + Vite | Modern, cepat, sesuai requirement |
| Routing | React Router DOM | Diperlukan untuk navigasi login/dashboard/404 |
| HTTP | Fetch API (bawaan) | Tidak perlu library tambahan |
| Styling | CSS biasa + CSS Variables | Kontrol penuh tanpa framework |
| Backend | Laravel 10 | Ekosistem PHP yang familiar |
| Auth | Laravel Sanctum (token) | Sederhana untuk SPA terpisah |
| Database | MySQL 8 | Sesuai requirement |

## Persyaratan

- Node.js ≥ 18
- npm ≥ 9
- PHP 8.1
- Composer 2
- MySQL 8

## Cara Menjalankan — Frontend

```bash
cd producthub

# Install dependency
npm install

# Buat file environment
cp .env.example .env
# Edit .env: pastikan VITE_API_BASE_URL=http://localhost:8000

# Jalankan dev server
npm run dev
# → Buka http://localhost:5173
```

## Cara Menjalankan — Backend

```bash
cd producthub-backend

# Install dependency
composer install

# Buat file environment
cp .env.example .env
# Edit .env: isi DB_PASSWORD sesuai MySQL lokal Anda

# Generate app key
php artisan key:generate

# Jalankan server
php artisan serve
# → Berjalan di http://localhost:8000
```

## Setup Database

```bash
# Buat database
mysql -u root -e "CREATE DATABASE producthub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Jalankan migration
php artisan migrate

# Jalankan seeder (membuat akun demo)
php artisan db:seed
```

## Konfigurasi Environment Variable

### Frontend (`producthub/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`producthub-backend/.env`)
```env
APP_NAME=ProductHub
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=producthub
DB_USERNAME=root
DB_PASSWORD=          # isi sesuai MySQL lokal
```

## Kredensial Demo

Dibuat oleh `UserSeeder`, tersimpan di database dengan password bcrypt:

| Field    | Value                  |
|----------|------------------------|
| Email    | `demo@producthub.test` |
| Password | `Demo@1234`            |

## Endpoint API Backend

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | `/api/login` | Tidak | Login, kembalikan token |
| POST | `/api/logout` | Bearer token | Cabut token aktif |
| GET | `/api/me` | Bearer token | Data user yang login |

## Arsitektur

```
[Browser: localhost:5173]
    ↕ React Router (SPA)
[Frontend React]
    ↕ Fetch API + Authorization: Bearer token
[Backend Laravel: localhost:8000]
    ↕ Sanctum Token Auth + MySQL
[Database: producthub]

[Frontend React]
    ↕ Fetch API (public)
[DummyJSON: dummyjson.com]
```

### Struktur Frontend

```
src/
├── components/    # UI reusable (Card, Grid, Modal, SearchBar, dll)
├── contexts/      # AuthContext — state autentikasi global
├── hooks/         # useProducts — logika fetch produk
├── layouts/       # DashboardLayout — wrapper Navbar + main
├── pages/         # LoginPage, DashboardPage, NotFoundPage
├── services/      # apiClient, authService, productService
└── utils/         # formatCurrency
```

### Alur Login

1. User isi form → frontend validasi (email format, field kosong)
2. `authService.login()` kirim POST ke `/api/login`
3. Backend validasi via `LoginRequest`, cek credentials via `Auth::attempt()`
4. Jika cocok → buat Sanctum token, kembalikan `{ token, user }`
5. Token disimpan di `AuthContext` (React state, in-memory)
6. React Router redirect ke dashboard

### Alur Logout

1. User klik Logout → `AuthContext.logout()`
2. POST ke `/api/logout` dengan `Authorization: Bearer {token}`
3. Backend cabut token via `currentAccessToken()->delete()`
4. State React dibersihkan → redirect ke login

## Keterbatasan

- Token tidak persisten: refresh halaman akan logout (disengaja, sesuai brief keamanan)
- Tidak ada registrasi publik (hanya akun demo via seeder)
- Tidak ada fitur CRUD produk (data hanya-baca dari DummyJSON)
- CORS dikonfigurasi untuk localhost saja (perlu diubah untuk production)
