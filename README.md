# 🏪 Shop Management System

ระบบจัดการร้านค้าออนไลน์แบบครบวงจร พัฒนาด้วย **Vue.js 3** และ **Express.js** + **TypeScript**

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js)
![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=flat-square&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?style=flat-square&logo=mongodb)

---

## 📖 สารบัญ

- [✨ Features](#-features)
- [🏗️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Getting Started](#-getting-started)
- [📚 API Documentation](#-api-documentation)
- [📸 Screenshots](#-screenshots)

---

## ✨ Features

### 🎨 Frontend (Vue.js 3)

- ✅ หน้า Dashboard สวยงาม แสดงสถิติและภาพรวม
- ✅ ระบบจัดการสินค้า (CRUD)
- ✅ ระบบจัดการหมวดหมู่ (CRUD)
- ✅ Responsive Design รองรับทุกอุปกรณ์
- ✅ Vue Router สำหรับ Navigation
- ✅ TypeScript Support

### 🔧 Backend (Express.js)

- ✅ RESTful API สำหรับจัดการ **Products** และ **Categories**
- ✅ Pagination พร้อม RegEx Search
- ✅ Soft Delete / Hard Delete
- ✅ Zod Schema Validation
- ✅ Swagger UI Documentation (Auto-generated)
- ✅ TypeScript with strict mode

---

## 🏗️ Project Structure

```
test-shop-management/
├── app-frontend/              # Vue.js Frontend
│   ├── src/
│   │   ├── App.vue            # Main App Component
│   │   ├── main.ts            # Entry Point
│   │   ├── router/            # Vue Router Configuration
│   │   └── views/             # Page Components
│   │       └── HomePage.vue   # หน้า Dashboard หลัก
│   ├── package.json
│   └── vite.config.ts
│
├── app-backend/               # Express.js Backend
│   ├── src/
│   │   ├── index.ts           # Entry Point
│   │   ├── config/            # Database & Swagger Config
│   │   ├── controllers/       # Request Handlers
│   │   ├── models/            # Mongoose Models
│   │   ├── routes/            # API Routes
│   │   ├── schemas/           # Zod Schemas
│   │   ├── services/          # Business Logic
│   │   └── types/             # TypeScript Types
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                  # ไฟล์นี้
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Description                         |
| ---------- | ------- | ----------------------------------- |
| Vue.js     | 3.5     | Progressive JavaScript Framework    |
| Vue Router | 4.6     | Official Router for Vue.js          |
| Vite       | 7.3     | Next Generation Frontend Build Tool |
| TypeScript | 5.9     | JavaScript with syntax for types    |

### Backend

| Technology | Version | Description                        |
| ---------- | ------- | ---------------------------------- |
| Express.js | 5.x     | Fast, unopinionated web framework  |
| MongoDB    | -       | NoSQL Database                     |
| Mongoose   | 9.x     | MongoDB ODM                        |
| Zod        | 4.x     | TypeScript-first schema validation |
| Swagger UI | 5.x     | API Documentation                  |

---

## ⚡ Runtime Compatibility

โปรเจคนี้สามารถใช้งานได้กับ **Bun**, **Node.js** (เช่น npm, yarn) ทุกคำสั่ง dev/build/lint สามารถรันผ่าน runtime ที่คุณเลือกได้

- ถ้าใช้ **Bun**: ใช้ `bun install`, `bun run dev`, ...
- ถ้าใช้ **npm**: ใช้ `npm install`, `npm run dev`, ...
- ถ้าใช้ **yarn**: ใช้ `yarn install`, `yarn run dev`, ...

> **หมายเหตุ:**
>
> - Node.js เวอร์ชันที่รองรับ: 20.19.0 ขึ้นไป หรือ 22.12.0 ขึ้นไป
> - Bun จะเร็วกว่า แต่ไม่บังคับ
> - สคริปต์ใน package.json รองรับทุก runtime

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 20.19.0 หรือ >= 22.12.0
- **Bun** (recommended) หรือ npm/yarn
- **MongoDB** (Local หรือ MongoDB Atlas)

### Clone Repository

```bash
git clone https://github.com/your-username/test-shop-management.git
cd test-shop-management
```

### Install Dependencies

#### Frontend

```bash
cd app-frontend
bun install      # หรือใช้ npm install หรือ yarn install
```

#### Backend

```bash
cd app-backend
bun install      # หรือใช้ npm install หรือ yarn install
```

---

## 🚀 Getting Started

### 1. Start Backend Server

```bash
cd app-backend
bun run dev      # หรือใช้ npm run dev หรือ yarn run dev
```

Backend จะทำงานที่: `http://localhost:3000`

### 2. Start Frontend Development Server

```bash
cd app-frontend
bun run dev      # หรือใช้ npm run dev หรือ yarn run dev
```

Frontend จะทำงานที่: `http://localhost:5173`

### 3. เปิด Browser

เข้าไปที่ `http://localhost:5173` เพื่อดู Application

---

## 📚 API Documentation

เมื่อ Backend Server ทำงาน สามารถเข้าถึง Swagger UI ได้ที่:

```
http://localhost:3000/api-docs
```

### API Endpoints

#### Products

| Method | Endpoint            | Description                               |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/api/products`     | ดึงรายการสินค้าทั้งหมด (พร้อม pagination) |
| GET    | `/api/products/:id` | ดึงข้อมูลสินค้าตาม ID                     |
| POST   | `/api/products`     | สร้างสินค้าใหม่                           |
| PUT    | `/api/products/:id` | อัพเดตข้อมูลสินค้า                        |
| DELETE | `/api/products/:id` | ลบสินค้า (Soft Delete)                    |

#### Categories

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/categories`     | ดึงรายการหมวดหมู่ทั้งหมด |
| GET    | `/api/categories/:id` | ดึงข้อมูลหมวดหมู่ตาม ID  |
| POST   | `/api/categories`     | สร้างหมวดหมู่ใหม่        |
| PUT    | `/api/categories/:id` | อัพเดตข้อมูลหมวดหมู่     |
| DELETE | `/api/categories/:id` | ลบหมวดหมู่               |

---

## 📸 Screenshots

### 🏠 Home Page / Dashboard

หน้าแรกแสดงภาพรวมของร้านค้า:

- 📊 **Stats Cards** - แสดงสถิติสินค้า, หมวดหมู่, ยอดขาย, ออเดอร์
- ⚡ **Quick Actions** - ทางลัดไปยังฟังก์ชันหลัก
- 📋 **Recent Products** - ตารางแสดงสินค้าล่าสุด

---

## 🔧 Available Scripts

### Frontend (`app-frontend/`)

| Script             | Description               |
| ------------------ | ------------------------- |
| `bun dev`          | Start development server  |
| `npm run dev`      | Start development server  |
| `yarn run dev`     | Start development server  |
| `bun run build`    | Build for production      |
| `npm run build`    | Build for production      |
| `yarn run build`   | Build for production      |
| `bun run preview`  | Preview production build  |
| `npm run preview`  | Preview production build  |
| `yarn run preview` | Preview production build  |
| `bun lint`         | Run ESLint + Oxlint       |
| `npm run lint`     | Run ESLint + Oxlint       |
| `yarn run lint`    | Run ESLint + Oxlint       |
| `bun format`       | Format code with Prettier |
| `npm run format`   | Format code with Prettier |
| `yarn run format`  | Format code with Prettier |

### Backend (`app-backend/`)

| Script         | Description                              |
| -------------- | ---------------------------------------- |
| `bun run dev`  | Start development server with hot reload |
| `npm run dev`  | Start development server with hot reload |
| `yarn run dev` | Start development server with hot reload |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Made with ❤️ using Vue.js and Express.js

---

<div align="center">
  <sub>⭐ Star this repository if you find it helpful!</sub>
</div>
