# Laporan Tugas 03 — Aplikasi Daftar Cryptocurrency

**Nama:** Muhammad Haris Al Fikri 
**NIM:** 053307724
**Mata Kuliah:** MSIM4401 — Pemrograman Aplikasi Mobile  
**Framework:** Ionic + Vue 3 + TypeScript  
**Sumber data:** `https://api.coinlore.net/api/tickers/`

## 1. Pendahuluan

Aplikasi ini dibuat untuk menampilkan daftar cryptocurrency secara real-time dari API publik Coinlore. Data diambil menggunakan `axios` yang didaftarkan sebagai plugin `vue-axios`, sehingga komponen Vue dapat mengakses HTTP client melalui `this.axios`, mengikuti pola Praktikum Aktivitas 12 (RESTful-API).

Setiap koin hanya menampilkan empat field yang diminta, yaitu `rank`, `name`, `symbol`, dan `price_usd`. Aplikasi juga menyediakan tombol **Refresh** untuk mengambil data terbaru, indikator loading ketika request berjalan, serta pesan error ketika request gagal.

## 2. Struktur Project

Struktur direktori yang relevan:

```text
crypto-list/
├── src/
│   ├── components/
│   │   └── CoinListItem.vue
│   ├── router/
│   │   └── index.ts
│   ├── theme/
│   │   └── variables.css
│   ├── types/
│   │   └── Coin.ts
│   ├── views/
│   │   └── Home.vue
│   ├── App.vue
│   ├── main.ts
│   └── vite-env.d.ts
├── tests/
│   ├── e2e/
│   │   └── specs/test.cy.ts
│   └── unit/
│       └── example.spec.ts
├── index.html
├── package.json
├── vite.config.ts
└── LAPORAN.md
```

**File yang dibuat:**

- `src/components/CoinListItem.vue` — komponen untuk satu baris data koin.
- `src/types/Coin.ts` — interface TypeScript untuk data koin.
- `src/views/Home.vue` — halaman utama; menggantikan `HomePage.vue` dari template.
- `LAPORAN.md` — laporan ini.

**File yang diubah:**

- `src/main.ts` — menambahkan `axios` dan `vue-axios`.
- `src/router/index.ts` — mengarahkan halaman utama ke `Home.vue` dan menghapus route detail pesan.
- `tests/unit/example.spec.ts` — mengganti test template dengan test halaman koin.
- `tests/e2e/specs/test.cy.ts` — menyesuaikan judul halaman yang diuji.
- `index.html` — mengganti judul aplikasi menjadi **Crypto List**.
- `package.json` — menyesuaikan nama package dan dependency axios.
- `vite.config.ts` — menetapkan pool Vitest `threads` agar test stabil di lingkungan WSL.

**File yang dihapus:**

- `src/components/MessageListItem.vue`
- `src/views/ViewMessagePage.vue` (nama aktual file detail pada template `list`; sesuai instruksi, route dan halamannya dihapus)
- `src/data/messages.ts` (data dummy yang sudah tidak digunakan)

## 3. Penjelasan Setiap File

### `src/main.ts`

File ini adalah titik masuk aplikasi Vue. Di dalamnya dibuat instance aplikasi, plugin `IonicVue`, router, dan plugin `VueAxios`. Setelah router siap, aplikasi dipasang ke elemen `#app`.

Bagian penting hasil perubahan:

```ts
import axios from 'axios';
import VueAxios from 'vue-axios';

// ...

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  // Daftarkan axios agar dapat diakses sebagai this.axios di seluruh komponen.
  .use(VueAxios, axios);
```

Dengan registrasi tersebut, komponen Options API dapat memanggil `this.axios.get(...)`. Import CSS Ionic, tema, dan pemanggilan `router.isReady()` tetap seperti bawaan template.

### `src/router/index.ts`

Router mengatur perpindahan halaman. Route `/` diarahkan ke `/home`, dan `/home` memakai komponen `Home.vue`. Route detail `/message/:id` beserta import `ViewMessagePage.vue` dihapus karena aplikasi ini tidak memiliki halaman detail koin.

Bagian penting:

```ts
import Home from '../views/Home.vue'

// ...

{
  path: '/home',
  name: 'Home',
  component: Home
}
```

Perubahan ini memastikan router tidak lagi merujuk ke file yang sudah dihapus.

### `src/components/CoinListItem.vue`

Komponen ini menerima satu objek `coin` melalui prop bertipe `Coin`. Template menggunakan satu `ion-item` dan satu `ion-label`, lalu di dalamnya dibuat grid tiga kolom:

1. Kolom rank: caption “Rank” dan nilai `coin.rank`.
2. Kolom identitas: `coin.name` berukuran kecil dan `coin.symbol` berukuran lebih besar.
3. Kolom harga: caption “USD” dan `coin.price_usd` tanpa konversi angka.

`<style scoped>` mengatur latar baris krem `#FFF3CD`, garis pemisah tipis, tinggi baris, serta grid agar harga tidak terpotong. `price_usd` tetap ditampilkan sebagai string sesuai respons API.

### `src/views/Home.vue`

File ini berisi logika utama pengambilan data dan tampilan daftar koin.

- `data()` menyimpan `coins`, `loading`, dan `error`.
- `mounted()` memanggil `refresh()` saat halaman pertama kali dibuka.
- `refresh()` mengosongkan pesan error, menyalakan loading, meminta data melalui `this.axios.get(API_URL)`, lalu menyimpan `response.data.data` ke `coins`.
- Jika request gagal, blok `catch` menampilkan pesan error yang mudah dipahami.
- Blok `finally` selalu mematikan loading, baik request berhasil maupun gagal.

Template memuat tombol **Refresh** berwarna `primary`, indikator `ion-spinner` saat loading, pesan error, dan `ion-list` yang merender `CoinListItem` untuk setiap koin. Tombol dinonaktifkan sementara ketika loading untuk mencegah request ganda.

### `src/types/Coin.ts`

File ini mendefinisikan bentuk data koin yang dipakai oleh `Home.vue` dan `CoinListItem.vue`:

```ts
export interface Coin {
  rank: number;
  name: string;
  symbol: string;
  price_usd: string;
}
```

Field `price_usd` bertipe `string` karena API mengirim harga dalam bentuk string. Dengan demikian, harga tidak dibulatkan atau kehilangan angka penting.

### Alur Pengambilan Data dengan Axios

```text
mounted()
  → refresh()
    → this.axios.get('https://api.coinlore.net/api/tickers/')
      → response.data.data
        → this.coins
          → CoinListItem untuk setiap koin
```

Saat tombol Refresh ditekan, `refresh()` dipanggil lagi sehingga request baru dilakukan dan daftar koin diperbarui dengan data terbaru dari API.

## 4. Source Code Inti

> Source code lengkap tersedia pada file project terlampir (folder `src/`).

### `src/main.ts` — baris yang berubah

```ts
import axios from 'axios';
import VueAxios from 'vue-axios';

// ...

const app = createApp(App)
  // ... .use(IonicVue) dan .use(router) tidak berubah
  .use(VueAxios, axios);
```

### `src/router/index.ts` — baris yang berubah

```ts
import Home from '../views/Home.vue'

// ...

{
  path: '/home',
  name: 'Home',
  component: Home
}

// Route /message/:id beserta import ViewMessagePage.vue dihapus.
```

### `src/components/CoinListItem.vue` — template dan script

```vue
<template>
  <ion-item lines="full" class="coin-item">
    <ion-label>
      <div class="coin-row">
        <div class="coin-column">
          <span class="caption">Rank</span>
          <span class="rank">{{ coin.rank }}</span>
        </div>

        <div class="coin-column name-column">
          <span class="name">{{ coin.name }}</span>
          <span class="symbol">{{ coin.symbol }}</span>
        </div>

        <div class="coin-column price-column">
          <span class="caption">USD</span>
          <span class="price">{{ coin.price_usd }}</span>
        </div>
      </div>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel } from '@ionic/vue';
import type { Coin } from '@/types/Coin';

// Data satu koin dikirim oleh Home.vue melalui prop.
defineProps<{ coin: Coin }>();
</script>
```

Bagian `<style scoped>` mengatur latar krem, garis pemisah, dan grid tiga kolom; CSS lengkap tidak ditampilkan di sini.

### `src/views/Home.vue` — template

```vue
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Cryptocurrency</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <ion-button
          class="refresh-button"
          expand="block"
          color="primary"
          :disabled="loading"
          @click="refresh"
        >
          Refresh
        </ion-button>
      </div>

      <div v-if="loading" class="ion-padding ion-text-center status">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Memuat data cryptocurrency...</p>
      </div>

      <div v-else-if="error" class="ion-padding status" role="alert">
        <ion-text color="danger">
          <p>{{ error }}</p>
        </ion-text>
      </div>

      <ion-list v-else class="coin-list">
        <CoinListItem v-for="coin in coins" :key="coin.rank" :coin="coin" />
      </ion-list>
    </ion-content>
  </ion-page>
</template>
```

### `src/views/Home.vue` — data, mounted, dan refresh

```ts
// ... import dan registrasi komponen ...

const API_URL = 'https://api.coinlore.net/api/tickers/';

export default defineComponent({
  // ...

  data() {
    return {
      coins: [] as Coin[],
      loading: true,
      error: '',
    };
  },

  mounted() {
    // Muat data pertama kali setelah komponen terpasang.
    this.refresh();
  },

  methods: {
    async refresh(): Promise<void> {
      this.loading = true;
      this.error = '';

      try {
        // Axios tersedia sebagai this.axios melalui plugin VueAxios di main.ts.
        const response = await this.axios.get<{ data: Coin[] }>(API_URL);
        this.coins = response.data.data;
      } catch (error) {
        console.error('Gagal mengambil data cryptocurrency:', error);
        this.error =
          'Gagal memuat data cryptocurrency. Periksa koneksi internet, lalu tekan Refresh.';
      } finally {
        this.loading = false;
      }
    },
  },
});
```

## 5. Cara Menjalankan

Dari folder induk tempat project akan dibuat:

```bash
# 1. Membuat project Ionic Vue dengan template list
npx @ionic/cli start crypto-list list --type vue

# 2. Masuk ke direktori project
cd crypto-list

# 3. Memasang dependency axios
npm install axios @types/axios vue-axios --save

# 4. Menjalankan aplikasi
npx @ionic/cli serve
```

Jika Ionic CLI sudah terpasang secara global, langkah terakhir dapat diganti dengan:

```bash
ionic serve
```

Untuk memeriksa hasil production build:

```bash
npm run build
```

Untuk menjalankan unit test satu kali:

```bash
npx vitest run
```

## 6. Hasil dan Analisis

### Hasil Tampilan

Aplikasi menampilkan daftar koin dari API Coinlore. Setiap baris berisi tiga kolom sesuai spesifikasi:

- **Rank** dan angka rank.
- **Nama** koin (kecil) dan **symbol** (besar).
- **USD** dan `price_usd` (besar), ditampilkan apa adanya sebagai string.

Latar setiap baris menggunakan warna krem `#FFF3CD` dengan garis pemisah tipis. Tombol **Refresh** berwarna biru (`color="primary"`) berada di atas daftar. Saat data sedang diambil, spinner dan teks “Memuat data cryptocurrency...” ditampilkan. Jika request gagal, pesan error berwarna merah muncul dan aplikasi tetap berjalan.

![Tampilan aplikasi](screenshot.png)

> Ganti placeholder `screenshot.png` dengan tangkapan layar aplikasi saat dijalankan.

### Cara Kerja Tombol Refresh

Saat halaman dibuka, `mounted()` otomatis memanggil `refresh()`. Tombol Refresh juga memanggil method yang sama. Setiap pemanggilan:

1. Mengaktifkan `loading` dan menghapus error lama.
2. Mengirim request baru ke `https://api.coinlore.net/api/tickers/` melalui `this.axios`.
3. Mengambil array koin dari `response.data.data`.
4. Mengganti isi `coins` sehingga tampilan list diperbarui.
5. Mematikan `loading` pada blok `finally`.

Tombol dinonaktifkan selama proses loading, sehingga request tidak terkirim berulang-ulang secara tidak sengaja.

### Hasil Pengujian

- **API:** request langsung menghasilkan HTTP 200 dan 100 data koin. Header `access-control-allow-origin: *` tersedia, sehingga browser dapat mengakses endpoint tanpa proxy.
- **Build:** `npm run build` berhasil tanpa error TypeScript. Masih ada peringatan non-fatal dari Vite mengenai `vue-axios` dan ukuran chunk.
- **Lint:** `npm run lint` berhasil tanpa error.
- **Unit test:** 3 test lulus, yaitu render data koin, Refresh memicu request ulang, dan pesan error saat request gagal.
- **Dev server:** `npx @ionic/cli serve --no-open --host 127.0.0.1` berjalan dan halaman merespons HTTP 200.

### Kendala dan Solusi

1. **Nama file template berbeda.** Template `list` menggunakan `HomePage.vue` dan `ViewMessagePage.vue`, bukan `Home.vue` dan `ViewMessage.vue`. File disesuaikan namanya agar mengikuti spesifikasi, lalu seluruh import dan route diperbarui.
2. **Ionic CLI belum terpasang global.** Scaffolding dan server dijalankan melalui `npx @ionic/cli`, sehingga tidak perlu instalasi global.
3. **`@types/axios` deprecated.** Package ini adalah stub dan menghasilkan peringatan saat instalasi. Package tetap dipasang sesuai instruksi; axios versi baru sudah menyediakan tipe TypeScript sendiri sehingga tidak menimbulkan error build.
4. **Test sempat timeout di WSL.** Worker Vitest bawaan timeout pada filesystem WSL. Konfigurasi test diubah memakai `pool: 'threads'`, kemudian seluruh test lulus.
5. **CORS.** Tidak ditemukan masalah CORS karena endpoint mengirim `access-control-allow-origin: *`. Jika di lingkungan lain request diblokir, solusinya adalah memakai proxy dev server Vite tanpa mengubah endpoint aplikasi.
6. **Validasi visual.** Environment pengujian tidak menyediakan browser grafis, sehingga pengecekan tampilan akhir perlu dilakukan manual di browser melalui `ionic serve`. Struktur tampilan dan perilaku data sudah diverifikasi melalui build, unit test, dan respons dev server.

## 7. Kesimpulan

Aplikasi berhasil dibuat menggunakan Ionic, Vue 3, dan TypeScript dengan data cryptocurrency langsung dari API Coinlore. Data diambil melalui `axios` yang terdaftar dengan `vue-axios`, lalu ditampilkan dalam komponen list tiga kolom berlatar krem. Tombol Refresh mengambil ulang data, sementara loading indicator dan penanganan error menjaga aplikasi tetap stabil ketika request sedang berjalan atau gagal. Build, lint, dan unit test juga berhasil dijalankan tanpa error.
