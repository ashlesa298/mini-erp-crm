# 🚀 Mini ERP + CRM Operations Portal

A full-stack **ERP + CRM Operations Portal** built for a wholesale/distribution business to manage customers, products, inventory, and stock movements from a single dashboard.

---

## 🌟 Project Overview

The **Mini ERP + CRM Operations Portal** is a responsive web application designed to simplify daily business operations.

The system currently provides:

- 👥 Customer CRM management
- 📦 Product management
- 📊 Inventory tracking
- 🔄 Stock IN/OUT movements
- ⚠️ Low-stock monitoring
- 🔐 JWT-based authentication
- 👤 Role-based user structure
- 📱 Responsive admin dashboard
- 🌐 Deployed frontend and backend

---

## 🛠️ Tech Stack

### 🎨 Frontend

- ⚛️ React
- 🟦 TypeScript
- ⚡ Vite
- 🎨 CSS
- 🔗 Axios
- 🧭 React Router

### ⚙️ Backend

- 🟢 Node.js
- 🚂 Express.js
- 🟦 TypeScript
- 🔐 JWT Authentication
- 🔒 bcrypt
- ✅ Zod Validation
- 🌐 REST APIs

### 🗄️ Database

- 🐘 PostgreSQL
- 🔷 Prisma ORM
- ☁️ Neon PostgreSQL

### 🚀 Deployment

- 🌐 Frontend: Netlify
- ⚙️ Backend: Render
- 🗄️ Database: Neon PostgreSQL
- 📦 Source Code: GitHub

---

## ✨ Features

### 🔐 Authentication

- User login
- User registration
- JWT authentication
- Protected routes
- Session restoration
- Role support

### 👥 Customer CRM

Users can:

- ➕ Add customers
- ✏️ Edit customers
- 🔍 Search customers
- 👀 View customer details
- 📝 Add follow-up notes
- 🏷️ Manage customer type
- 📌 Manage customer status
- 📄 Pagination

Customer Types:

- 🛍️ Retail
- 🏢 Wholesale
- 🚚 Distributor

Customer Status:

- 🟡 Lead
- 🟢 Active
- ⚪ Inactive

### 📦 Products & Inventory

Users can:

- ➕ Add products
- 👀 View product details
- 🔍 Search products
- 🏷️ Filter by category
- ⚠️ Identify low-stock products
- 📊 View current stock
- 📋 View minimum stock level
- 🏭 View warehouse/location
- 🔄 Record stock movements
- 📜 View stock movement history

Stock movement types:

- 🟢 IN
- 🔴 OUT

The backend prevents stock from becoming negative.

---

## 👤 User Roles

The application supports the following roles:

| Role | Description |
|---|---|
| 👑 ADMIN | Full system access |
| 💼 SALES | Sales and customer operations |
| 📦 WAREHOUSE | Inventory and stock operations |
| 💰 ACCOUNTS | Accounts-related operations |

> Role-based access can be extended further as additional modules are implemented.

---

## 🔗 Live Application

### 🌐 Frontend

https://mini-erp-crm-ashlesa.netlify.app/

### ⚙️ Backend API

https://mini-erp-crm-5.onrender.com

### 📚 API Base URL

https://mini-erp-crm-5.onrender.com/api

### 💻 GitHub Repository

https://github.com/ashlesa298/mini-erp-crm

---

## 🔑 Test Login

### 👑 Admin

**Email**
```text
admin@minierp.com
