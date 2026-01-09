# Shop Management API

RESTful API สำหรับระบบจัดการร้านค้า พัฒนาด้วย Express.js + TypeScript + MongoDB

## 🚀 Features

- ✅ RESTful API สำหรับจัดการ **Products** และ **Categories**
- ✅ Pagination พร้อม RegEx Search
- ✅ Soft Delete / Hard Delete
- ✅ Zod Schema Validation
- ✅ Swagger UI Documentation (Auto-generated)
- ✅ TypeScript with strict mode

## 📁 Project Structure

```
app-backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── config/
│   │   ├── database.ts       # MongoDB connection
│   │   └── swagger.ts        # OpenAPI spec (auto-generated from Zod)
│   ├── controllers/          # Request handlers
│   │   ├── category.controller.ts
│   │   └── product.controller.ts
│   ├── models/               # Mongoose models
│   │   ├── category.model.ts
│   │   └── product.model.ts
│   ├── routes/               # API routes
│   │   ├── index.ts
│   │   ├── category.routes.ts
│   │   └── product.routes.ts
│   ├── schemas/              # Zod schemas (Single Source of Truth)
│   │   ├── index.ts
│   │   ├── common.schema.ts  # Pagination, ID params
│   │   ├── category.schema.ts
│   │   └── product.schema.ts
│   ├── services/             # Business logic
│   │   ├── category.service.ts
│   │   └── product.service.ts
│   └── types/                # TypeScript types
│       └── index.ts
├── package.json
└── tsconfig.json
```

## 🛠️ Installation

### Prerequisites

- Node.js >= 18
- MongoDB (local หรือ MongoDB Atlas)
- Bun (recommended) หรือ npm/yarn

### Setup

```bash
# Clone repository
cd app-backend

# Install dependencies
bun install
# หรือ
npm install

# Start development server
bun run dev
# หรือ
npm run dev
```

### Environment Variables

สร้างไฟล์ `.env` (optional):

```env
MONGODB_URI=mongodb://localhost:27017/shop-management
PORT=3000
```

## 📖 API Documentation

เมื่อ server รันแล้ว เข้าดู Swagger UI ได้ที่:

**http://localhost:3000/docs**

---

## 📚 API Endpoints

### Categories

| Method   | Endpoint                  | Description                           |
| -------- | ------------------------- | ------------------------------------- |
| `GET`    | `/categories`             | ดึงรายการหมวดหมู่ทั้งหมด (pagination) |
| `GET`    | `/category/:id`           | ดึงข้อมูลหมวดหมู่ตาม ID               |
| `POST`   | `/category`               | สร้างหมวดหมู่ใหม่                     |
| `PUT`    | `/category/:id`           | แก้ไขหมวดหมู่                         |
| `DELETE` | `/category/:id`           | ลบหมวดหมู่ (soft delete)              |
| `DELETE` | `/category/:id?hard=true` | ลบหมวดหมู่ (hard delete)              |

### Products

| Method   | Endpoint                 | Description                         |
| -------- | ------------------------ | ----------------------------------- |
| `GET`    | `/products`              | ดึงรายการสินค้าทั้งหมด (pagination) |
| `GET`    | `/product/:id`           | ดึงข้อมูลสินค้าตาม ID               |
| `POST`   | `/product`               | สร้างสินค้าใหม่                     |
| `PUT`    | `/product/:id`           | แก้ไขสินค้า                         |
| `DELETE` | `/product/:id`           | ลบสินค้า (soft delete)              |
| `DELETE` | `/product/:id?hard=true` | ลบสินค้า (hard delete)              |

---

## 🔍 Query Parameters

### Pagination & Search

```
GET /products?page=1&limit=10&search=keyword
GET /categories?page=2&limit=20&search=electronics
```

| Parameter | Type   | Default | Description                   |
| --------- | ------ | ------- | ----------------------------- |
| `page`    | number | 1       | หน้าที่ต้องการ                |
| `limit`   | number | 10      | จำนวนรายการต่อหน้า (max: 100) |
| `search`  | string | -       | คำค้นหา (รองรับ RegEx)        |

### Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalPage": 5,
    "totalCount": 50
  }
}
```

---

## 📝 Request Examples

### Create Category

```bash
curl -X POST http://localhost:3000/category \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }'
```

### Create Product

```bash
curl -X POST http://localhost:3000/product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Apple smartphone",
    "price": 35900,
    "quantity": 100,
    "categoryId": "507f1f77bcf86cd799439011"
  }'
```

### Search Products (RegEx)

```bash
# ค้นหาสินค้าที่ชื่อขึ้นต้นด้วย "iPhone"
curl "http://localhost:3000/products?search=^iPhone"

# ค้นหาสินค้าที่มีคำว่า "phone" (case-insensitive)
curl "http://localhost:3000/products?search=phone"
```

### Soft Delete vs Hard Delete

```bash
# Soft delete (ตั้ง isDeleted = true)
curl -X DELETE http://localhost:3000/product/507f1f77bcf86cd799439011

# Hard delete (ลบออกจาก database จริง)
curl -X DELETE "http://localhost:3000/product/507f1f77bcf86cd799439011?hard=true"
```

---

## 🏗️ Tech Stack

| Technology             | Purpose               |
| ---------------------- | --------------------- |
| **Express.js 5**       | Web framework         |
| **TypeScript**         | Type safety           |
| **MongoDB + Mongoose** | Database              |
| **Zod**                | Schema validation     |
| **zod-to-openapi**     | Auto-generate Swagger |
| **Swagger UI**         | API documentation     |
| **tsx**                | TypeScript execution  |

---

## 🔧 Development

### Available Scripts

```bash
# Development with hot-reload
bun run dev

# Type check
npx tsc --noEmit
```

### Adding New API Endpoint

1. **สร้าง Zod Schema** ใน `src/schemas/`
2. **สร้าง Model** ใน `src/models/`
3. **สร้าง Service** ใน `src/services/`
4. **สร้าง Controller** ใน `src/controllers/`
5. **สร้าง Routes** ใน `src/routes/`
6. **Register Swagger** ใน `src/config/swagger.ts`

> 💡 **Tip:** Swagger จะ auto-generate จาก Zod schemas - ไม่ต้องเขียน documentation แยก!

---

## 📄 License

ISC
