# YUAL - Shopify Clone E-commerce Platform

A complete e-commerce platform built with Next.js, Node.js, PostgreSQL, and Prisma. This project demonstrates real-world system architecture and best practices for building scalable web applications.

## 🏗️ System Architecture

### Backend (Node.js + Express)
- **RESTful API** with Express.js
- **PostgreSQL** database with Prisma ORM
- **JWT Authentication** with bcrypt password hashing
- **Role-based Access Control** (Customer/Admin)
- **Cart & Order Management** with transaction support

### Frontend (Next.js 14)
- **App Router** with TypeScript
- **Tailwind CSS** for styling
- **React Context** for state management
- **Axios** for API communication
- **Responsive Design** with mobile-first approach

### Key Features
- ✅ User Authentication & Authorization
- ✅ Product Management with Variants
- ✅ Shopping Cart with Real-time Updates
- ✅ Order Processing & Status Tracking
- ✅ Admin Dashboard
- ✅ Fake Payment System
- ✅ Inventory Management
- ✅ Responsive Design

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd yual
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment variables
# Edit .env with your database credentials

# Install PostgreSQL and create database
createdb yual_db

# Run database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

The backend will be running on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start frontend server
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🗄️ Database Schema

### Core Models

**User**
- Authentication and role management
- Supports CUSTOMER and ADMIN roles

**Product**
- Product information and metadata
- One-to-many relationship with variants

**ProductVariant**
- Size, color, and other variations
- Individual pricing and inventory

**Cart & CartItem**
- Session-based shopping cart
- Supports guest and authenticated users

**Order & OrderItem**
- Order processing and tracking
- Price snapshots at time of purchase

## 🔐 Default Accounts

After seeding, you can use these accounts:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## 📱 Application Flow

### Customer Journey
1. Browse products on homepage
2. View product details with variants
3. Add items to cart
4. Proceed to checkout
5. Place order (fake payment)
6. View order history

### Admin Workflow
1. Login to admin dashboard
2. View analytics and metrics
3. Manage products (CRUD operations)
4. Process orders and update status
5. Monitor inventory levels

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:studio # Open Prisma Studio
npm run prisma:seed  # Seed database
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/mine` - Get user orders
- `GET /api/orders` - Get all orders (Admin)
- `PATCH /api/orders/:id/status` - Update order status (Admin)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 📦 Production Considerations

This is a learning project. For production deployment, consider:

- **Database**: Use managed PostgreSQL service
- **File Storage**: Use AWS S3 or similar for product images
- **Payments**: Integrate real payment gateway (Stripe, PayPal)
- **Email**: Add email service for order confirmations
- **Caching**: Implement Redis for session and cart storage
- **Monitoring**: Add logging and monitoring services
- **CDN**: Use CDN for static assets
- **SSL**: Configure HTTPS certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Feel free to use it for learning and experimentation.

## 🙏 Acknowledgments

- Built following modern web development best practices
- Inspired by Shopify's e-commerce platform
- Uses excellent open-source libraries and tools

