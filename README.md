# Bunda Care Admin Dashboard

Selamat datang di repositori Bunda Care Admin Dashboard! Proyek ini berfungsi sebagai antarmuka administrasi (web frontend) untuk mengelola data dan fungsionalitas aplikasi Bunda Care Mobile. Dibangun dengan React dan Vite, dashboard ini dirancang untuk memberikan pengalaman yang efisien dan responsif bagi administrator.

## Tujuan Proyek

Tujuan utama dari dashboard ini adalah untuk menyediakan alat yang komprehensif bagi administrator Bunda Care untuk:

*   Mengelola pengguna dan profil mereka.
*   Mengelola konten informasi (artikel, panduan, dll.).
*   Memantau data penting terkait aplikasi mobile.
*   Mengelola jadwal atau konfigurasi tertentu yang relevan dengan fungsionalitas aplikasi.

## Fitur Utama (Contoh)

*   **Manajemen Pengguna:** Melihat, menambah, mengedit, dan menghapus data pengguna aplikasi mobile.
*   **Manajemen Konten:** Mengelola artikel, tips, atau sumber daya informasi lainnya yang ditampilkan di aplikasi.
*   **Pelacakan Statistik:** Menampilkan grafik dan data analitik terkait penggunaan aplikasi dan pertumbuhan bayi.
*   **Sistem Notifikasi:** Mengirim notifikasi atau pengumuman kepada pengguna aplikasi.
*   **Konfigurasi Aplikasi:** Mengelola pengaturan dan parameter aplikasi mobile.

## Teknologi yang Digunakan

Proyek ini memanfaatkan tumpukan teknologi modern untuk membangun antarmuka admin yang kuat dan efisien:

*   **Frontend Framework:** React 19.x
*   **Build Tool:** Vite 7.x
*   **Styling:** Tailwind CSS 4.x, Class Variance Authority (cva), clsx, tailwind-merge, tw-animate-css
*   **UI Components:** Radix UI (Avatar, Checkbox, Dialog, Dropdown Menu, Label, Select, Separator, Slot, Switch, Tabs, Toggle, Toggle Group, Tooltip), Vaul (Drawer components)
*   **State Management:** Zustand (global state), @tanstack/react-query (server state)
*   **Form Handling & Validation:** React Hook Form, Zod (schema validation), @hookform/resolvers
*   **Routing:** React Router DOM 7.x
*   **HTTP Client:** Axios
*   **Data Table:** @tanstack/react-table
*   **Charting & Visualization:** Recharts 2.x
*   **Drag-and-Drop:** @dnd-kit (core, modifiers, sortable, utilities)
*   **Icons:** Lucide React, @tabler/icons-react
*   **Theming:** Next Themes
*   **Notifications:** Sonner (toast messages)
*   **Utility Libraries:** browser-image-compression
*   **Code Quality:** ESLint, Prettier

## Persyaratan Sistem

Pastikan Anda memiliki Node.js (versi 18.x atau lebih tinggi) dan npm (atau Yarn/pnpm) terinstal di sistem Anda.

## Instalasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/your-username/bunda_care_webfrontend.git
    cd bunda_care_webfrontend
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    # atau
    # yarn install
    # atau
    # pnpm install
    ```

3.  **Konfigurasi Variabel Lingkungan:**
    Buat file `.env` di root proyek. Tambahkan variabel lingkungan yang diperlukan untuk koneksi ke API backend. Contoh:
    ```ini
    VITE_API_BASE_URL=http://localhost:8000/api
    # Tambahkan variabel lain yang dibutuhkan, seperti kunci API, dll.
    ```
    *(Sesuaikan dengan detail API backend Anda)*

## Menjalankan Aplikasi

Setelah semua dependensi terinstal dan variabel lingkungan dikonfigurasi, Anda dapat menjalankan aplikasi dalam mode pengembangan:

```bash
npm run dev
# atau
# yarn dev
# atau
# pnpm dev
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia). Buka browser Anda dan navigasikan ke alamat tersebut untuk mengakses dashboard admin.

## Membangun untuk Produksi

Untuk membuat *build* aplikasi yang siap produksi:

```bash
npm run build
# atau
# yarn build
# atau
# pnpm build
```

Ini akan membuat direktori `dist/` dengan semua aset statis yang dioptimalkan untuk *deployment*.

## Kontribusi

Kami menyambut kontribusi! Jika Anda ingin berkontribusi pada proyek ini, silakan:

1.  *Fork* repositori ini.
2.  Buat *branch* baru (`git checkout -b feature/nama-fitur`).
3.  Lakukan perubahan Anda.
4.  Commit perubahan (`git commit -m 'Tambahkan fitur baru'`).
5.  Push ke *branch* Anda (`git push origin feature/nama-fitur`).
6.  Buka *Pull Request*.

## Lisensi

Proyek ini dilisensikan di bawah [Nama Lisensi Anda, misal MIT License]. Lihat file `LICENSE` untuk detail lebih lanjut.

---

Terima kasih telah menggunakan Bunda Care Admin Dashboard!
