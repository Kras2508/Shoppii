# 🛒 E-Commerce Marketplace - Database Project

**Đồ án Database cho hệ thống Thương mại điện tử với MySQL**

---

## 📁 CẤU TRÚC PROJECT

```
Assignment/
├── 📄 README.md                          # Documentation chính
├── 📄 package.json                       # Dependencies (Backend + Frontend)
├── 📄 vite.config.ts                     # Vite config cho React
├── 📄 index.html                         # Entry point cho Vite
│
├── 📂 src/                               # Source code
│   ├── 📄 server.js                      # ⭐ Express server (Backend entry)
│   ├── 📄 main.tsx                       # React entry point
│   ├── 📄 App.tsx                        # React App component
│   ├── 📄 index.css                      # Global styles
│   │
│   ├── 📂 config/                        # ⚙️ Configuration
│   │   └── 📄 database.js                # MySQL connection pool
│   │
│   ├── 📂 routes/                        # 🛤️ API Routes (Backend)
│   │   ├── 📄 auth.js                    # Login/Logout/Session
│   │   ├── 📄 dashboard.js               # Dashboard stats
│   │   ├── 📄 products.js                # Product CRUD + filters
│   │   └── 📄 statistics.js              # Gọi Functions & Procedures
│   │
│   ├── 📂 sql/                           # 🗄️ Database Scripts
│   │   ├── 📄 part1_create_tables.sql    # ⭐ CREATE DATABASE + TABLES
│   │   ├── 📄 part1_insert_data.sql      # ⭐ INSERT sample data
│   │   └── 📄 part2_functions_procedures_triggers.sql  # ⭐ Functions/Procedures/Triggers
│   │
│   ├── 📂 pages/                         # 📄 React Pages (20+ pages)
│   ├── 📂 components/                    # 🧩 React Components (180+ UI components)
│   ├── 📂 layouts/                       # 📐 Layouts
│   ├── 📂 utils/                         # 🛠️ Utilities
│   ├── 📂 styles/                        # 🎨 Styles
│   ├── 📂 public/                        # 📁 Static HTML (Legacy)
│   └── 📂 guidelines/                    # 📋 Guidelines
│
└── 📂 node_modules/                      # Dependencies (auto-generated)
```

---

## 🗄️ DATABASE SCHEMA

### **Database Name:** `ecommerce_db`

### **Tables (15 tables):**

| # | Table Name | Mô tả | Key Relationships |
|---|------------|-------|-------------------|
| 1 | `Account` | Tài khoản người dùng (superclass) | 1-1 với Customer/Shop/Admin |
| 2 | `Customer` | Thông tin khách hàng | FK → Account |
| 3 | `Shop` | Thông tin cửa hàng | FK → Account |
| 4 | `Admin` | Quản trị viên | FK → Account |
| 5 | `Category` | Danh mục sản phẩm (self-referencing) | FK → Category (parent) |
| 6 | `Product` | Sản phẩm | FK → Shop, Category |
| 7 | `ProductItem` | Biến thể sản phẩm (color, type) | FK → Product, Shop |
| 8 | `Cart` | Giỏ hàng | 1-1 với Customer |
| 9 | `CartItem` | Chi tiết giỏ hàng | FK → Cart, ProductItem |
| 10 | `Shipping` | Phương thức vận chuyển | - |
| 11 | `Voucher` | Mã giảm giá | - |
| 12 | `Order` | Đơn hàng | FK → Customer, Shipping, Voucher |
| 13 | `OrderItem` | Chi tiết đơn hàng | FK → Order, ProductItem, Shop |
| 14 | `Review` | Đánh giá (polymorphic) | FK → Customer, target_id |

---

## ⚙️ PART 2: FUNCTIONS, PROCEDURES & TRIGGERS

**📄 File:** `src/sql/part2_functions_procedures_triggers.sql`  
**📄 Checklist:** `PART2_CHECKLIST.md` (Chi tiết yêu cầu giảng viên)  
**📄 Test:** `src/sql/test_part2.sql` (Test queries)

### **✅ YÊU CẦU GIẢNG VIÊN - ĐÃ HOÀN THÀNH:**

| Requirement | Required | Completed | Status |
|-------------|----------|-----------|--------|
| **Functions** | ≥2 | **4** | ✅ 200% |
| **Procedures** | ≥2 | **4** | ✅ 200% |
| **Triggers** | ≥2 | **6** | ✅ 300% |

---

### **📊 FUNCTIONS (4):**

#### 1. `fn_calculate_order_total(order_id)` 
- **Input:** order_id (INT)
- **Return:** DECIMAL(15,2) - Tổng tiền đơn hàng
- **Tables:** OrderItem + Order (2 tables JOIN)
- ✅ Có input parameter, return value, SELECT 2+ tables

#### 2. `fn_get_customer_total_spent(customer_id)`
- **Input:** customer_id (INT)
- **Return:** DECIMAL(15,2) - Tổng chi tiêu khách hàng
- **Tables:** Order + Customer (2 tables JOIN)
- ✅ Có input parameter, return value, SELECT 2+ tables

#### 3. `fn_get_shop_revenue(shop_id)`
- **Input:** shop_id (INT)
- **Return:** DECIMAL(15,2) - Doanh thu shop
- **Tables:** OrderItem + Order + Shop (3 tables JOIN)
- ✅ Bonus function

#### 4. `fn_calculate_shop_rating(shop_id)`
- **Input:** shop_id (INT)
- **Return:** DECIMAL(3,2) - Rating trung bình
- **Tables:** Review + Shop (2 tables JOIN)
- ✅ Bonus function

---

### **🔧 PROCEDURES (4):**

#### 1. `sp_get_shop_revenue_report(shop_id, from_date, to_date)`
- **Inputs:** shop_id, from_date, to_date
- **Outputs:** 2 result sets (summary + top products)
- ✅ **IF:** Validate shop exists (FK check)
- ✅ **WHERE:** Date range filter
- ✅ **JOIN:** 4-way join (Shop + OrderItem + Order + Product)
- ✅ **GROUP BY:** Aggregate by shop & product

#### 2. `sp_create_order_from_cart(...)`
- **Inputs:** customer_id, shipping_id, voucher_id, address, payment_method
- **Output:** order_id
- ✅ **IF:** Validate Customer, Shipping, Cart exists (FK checks)
- ✅ **CASE:** Calculate discount (Percentage/Amount)
- ✅ **WHERE + JOIN:** Calculate subtotal, move cart items
- ✅ **Complex:** INSERT order, UPDATE stats, DELETE cart

#### 3. `sp_get_product_statistics(category_id, shop_id, min_price, max_price)`
- **Inputs:** Optional filters
- **Output:** Product statistics
- ✅ **WHERE:** Multiple filter conditions
- ✅ **JOIN:** 6 tables (Product + Category + Shop + ProductItem + OrderItem + Review)
- ✅ **GROUP BY:** Aggregate by product

#### 4. `sp_apply_voucher(voucher_code, order_amount, OUT discount, OUT valid, OUT message)`
- **Inputs:** voucher_code, order_amount
- **Outputs:** discount_amount, is_valid, message
- ✅ **IF:** Validate voucher, expiry, usage limit, min order
- ✅ **CASE:** Calculate discount by type
- ✅ Multiple validation rules

---

### **⚡ TRIGGERS (6):**

#### 1. `trg_order_item_before_insert` (BEFORE INSERT)
- ✅ **DERIVED VALUE:** Auto-set `price_at_purchase` from ProductItem.price
- ✅ **DERIVED VALUE:** Auto-set `shop_id` from ProductItem
- ✅ **ENFORCE RULE:** Check stock availability

#### 2. `trg_order_item_after_insert` (AFTER INSERT)
- Decrease ProductItem stock
- Update Product status to 'Out of stock' if needed

#### 3. `trg_review_before_insert` (BEFORE INSERT)
- ✅ **ENFORCE RULE:** Rating must be 1-5
- ✅ **ENFORCE RULE:** Can only review purchased products
- ✅ **ENFORCE RULE:** Order must be delivered

#### 4. `trg_review_after_insert` (AFTER INSERT)
- Auto-update Shop.rating when new review added

#### 5. `trg_product_item_before_update` (BEFORE UPDATE)
- ✅ **ENFORCE RULE:** Stock cannot be negative
- ✅ **ENFORCE RULE:** Price cannot be negative

#### 6. `trg_account_after_insert` (AFTER INSERT)
- ✅ **DERIVED VALUE:** Auto-create Customer/Shop/Admin record
- ✅ **DERIVED VALUE:** Auto-create Cart for customers

---

## 🚀 SETUP INSTRUCTIONS

### **Prerequisites:**
- ✅ MySQL 8.0+
- ✅ Node.js 16+
- ✅ npm

### **BƯỚC 1: SETUP DATABASE**

#### 1.1. Tạo MySQL User
```sql
CREATE USER 'sManager'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'sManager'@'localhost';
FLUSH PRIVILEGES;
```

#### 1.2. Chạy SQL Scripts
```powershell
cd "c:\Learning\Database\Assignment"
mysql -u sManager -p < src/sql/part1_create_tables.sql
mysql -u sManager -p < src/sql/part1_insert_data.sql
mysql -u sManager -p < src/sql/part2_functions_procedures_triggers.sql
```

### **BƯỚC 2: SETUP BACKEND**

#### 2.1. Install Dependencies
```powershell
npm install
```

#### 2.2. Tạo file `.env`
```env
DB_HOST=localhost
DB_USER=sManager
DB_PASSWORD=your_password_here
DB_NAME=ecommerce_db
DB_PORT=3306
PORT=3000
SESSION_SECRET=ecommerce-secret-key-2025
```

#### 2.3. Start Backend
```powershell
node src/server.js
```
Backend: `http://localhost:3000`

### **BƯỚC 3: SETUP FRONTEND**

```powershell
npm run dev
```
Frontend: `http://localhost:5173`

---

## 👤 DEMO ACCOUNTS

- **Admin:** `admin@ecommerce.com` / `any`
- **Shop:** `john.shop@email.com` / `any`
- **Customer:** `alice@email.com` / `any`

---

## 🐛 TROUBLESHOOTING

### Database connection failed
- Check MySQL đang chạy
- Check thông tin trong `.env`

### Port already in use
```powershell
# Đổi PORT trong .env
PORT=3001
```

---

## 📚 TECH STACK

- **Database:** MySQL 8.0
- **Backend:** Node.js, Express, MySQL2
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI:** Shadcn UI, Radix UI

---

## 🎯 PROJECT STATUS

- [x] Part 1: SQL Schema (15 tables) ✅
- [x] Part 2: Functions/Procedures/Triggers ✅
- [x] Backend API setup ✅
- [x] Frontend React setup ✅
- [ ] Full integration testing
- [ ] Deployment

---

**⚠️ LƯU Ý:** Project học tập - không dùng production. Password chưa hash (dùng bcrypt trong production)
  
