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
- 
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
git clone https://github.com/salwaaprsn/ToDoList.git](https://github.com/aminatulmaimuna/Pemoggraman-Prangkat-Mobile-11.git
cd ToDoList
```

2. Install dependency

```bash
npm install
```

3. Jalankan project

```bash
npx expo start
```
---

## 🗃️ Perancangan Database

Aplikasi ini menggunakan database SQLite dengan satu tabel utama bernama `todos`
yang memiliki struktur sebagai berikut:
- 🆔 id : INTEGER (Primary Key)
- 📝 title : TEXT
- ✅ completed : INTEGER
- ⏰ created_at : TEXT

---

## 👩‍💻 Author

Nama : Aminatul Maimunah
