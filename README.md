
# ⚙️ MediStore Backend API

This is the robust RESTful API powering the **MediStore** marketplace. It handles complex business logic, secure user authentication, and relational data management for a multi-vendor pharmacy ecosystem.

## 🚀 Live API Base
The frontend connected to this API can be found at: **[MediStore Live](https://medistore-iota.vercel.app)**

---

## ✨ Core Backend Functionalities

### 🛡️ Authentication & Security
*   **Role-Based Access Control (RBAC)**: Implements strict permissions for `CUSTOMER`, `SELLER`, and `ADMIN` roles.
*   **Session Tracking**: Dedicated session management that logs `ipAddress` and `userAgent` for security auditing.
*   **Data Integrity**: Utilizes Prisma's `relationMode` and cascading deletes to ensure consistent data across `User`, `Session`, and `Account` models.

### 📦 Inventory & Marketplace Logic
*   **Relational Mapping**: Manages complex one-to-many and many-to-many relationships between Medicines, Categories, and Orders.
*   **Stock Management**: Backend logic to handle medicine inventory, pricing (Float), and manufacturer details.
*   **Advanced Querying**: Database indexing on `name`, `categoryId`, and `sellerId` to ensure high-performance search and filtering.

### 🛒 Order Processing System
*   **Status Management**: A state-machine approach to order tracking using Enums: `PLACED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, and `CANCELLED`.
*   **Transaction Reliability**: Linked `orderItem` architecture ensures price snapshots at the time of purchase for historical accuracy.

---

## 🛠️ Tech Stack
*   **Runtime**: Node.js
*   **Framework**: Express.js / Next.js API Routes
*   **Language**: TypeScript (Strictly Typed)
*   **ORM**: Prisma
*   **Database**: PostgresSQL

---

## 🏗️ Database Schema Overview (Prisma)
The backend architecture is built upon a highly structured MySQL schema:
*   **User Model**: Supports social accounts and traditional credential-based login.
*   **Medicine Model**: Handles product descriptions, JSON-based image storage, and seller associations.
*   **Review System**: Implements a `@unique` constraint on `[userId, medicineId]` to prevent duplicate reviews from a single user.
*   **Indexing strategy**: Strategic use of `@@index` on foreign keys to optimize join operations.

---

## 🚀 Development Setup

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/muhiburmahin/medistore-backend.git](https://github.com/muhiburmahin/medistore-backend.git)
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="mysql://username:password@host:port/database"
    JWT_SECRET="your_secret_key"
    ```
4.  **Database Migration & Client Generation**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```
5.  **Start Development Server**:
    ```bash
    npm run dev
    ```

---

**Developed by [Md Muhibur Rahman Mahin](https://github.com/muhiburmahin)**
*Full-Stack Web Developer | Next.js & TypeScript Specialist*
