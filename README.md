# 📱 Aplikasi Todo List Berbasis Expo dan SQLite

## 📌 Deskripsi Aplikasi

Aplikasi Todo List ini merupakan aplikasi mobile sederhana yang dikembangkan
menggunakan React Native dengan framework Expo serta memanfaatkan SQLite
sebagai media penyimpanan data lokal. 

---

## ✨ Fitur Aplikasi

- ➕ Menambahkan data todo
- ✏️ Mengedit data todo
- 🗑️ Menghapus data todo
- ✅ Menandai todo sebagai selesai (Done)
- ⏳ Menampilkan todo yang belum selesai (Undone)
- 📋 Menampilkan seluruh data todo (All)
- 💾 Penyimpanan data secara lokal menggunakan SQLite

---

## 📁 Struktur Folder Project

```text
RN-EXPO-SQLITE-MAIN
├── .expo
├── .vscode
├── app
│   ├── components
│   │   └── TodoList.tsx
│   ├── services
│   │   └── todoService.ts
│   ├── _layout.tsx
│   └── index.tsx
├── assets
├── node_modules
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```
---

## 🛠️ Teknologi yang Digunakan

- ⚛️ React Native
- 🚀 Expo
- 🟦 TypeScript
- 🗄️ SQLite (Expo SQLite)
- 🧭 Expo Router

---

## ▶️ Cara Menjalankan Aplikasi

1. Clone repository

```bash
git clone https://github.com/salwaaprsn/ToDoList.git
cd RN-EXPO-SQLITE-MAIN
```

2. Install dependency

```bash
npm install
```

3. Jalankan project

```bash
npx expo start
```

4. Pilih metode:

- Tekan `a` untuk Android Emulator
- Tekan `w` untuk Web Browser
- Scan QR Code untuk menjalankan di perangkat fisik

---

## 🗃️ Perancangan Database

Aplikasi ini menggunakan database SQLite dengan satu tabel utama bernama `todos`
yang memiliki struktur sebagai berikut:
- 🆔 id : INTEGER (Primary Key)
- 📝 title : TEXT
- ✅ completed : INTEGER
- ⏰ created_at : TEXT

---

## 🔗 Link Terkait

- **Video Demonstrasi:** [Tonton Demo](https://drive.google.com/drive/folders/18ssKoNB4Lmg9RsoGWoqn0i4u0Ejz3z3G)

---

## 👩‍💻 Author

Nama : Salwa Aprilia Santi

Kelas: TI23F
