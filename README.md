# 🛍️ TezCart - Complete E-Commerce Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A **production-ready, full-stack multi-vendor e-commerce platform** built with modern technologies. TezCart provides a complete marketplace solution comparable to Amazon, Flipkart, and Shopify.

## ✨ Features

### 🛒 **Complete E-Commerce**
- Full product catalog with categories & search
- Advanced filtering & sorting
- Shopping cart (guest & user)
- Multi-step checkout
- Order tracking & management
- Wishlist with price alerts
- Product reviews & Q&A

### 🏪 **Multi-Vendor Marketplace**
- Vendor registration & onboarding
- Shop profiles with branding
- Seller dashboard & analytics
- Order fulfillment workflow
- Tier system (Bronze → Platinum)
- Commission management

### 💳 **Payment Processing**
- Multiple payment methods (Card, UPI, Net Banking, Wallet, COD)
- Gateway integration ready (Stripe, Razorpay, PayPal)
- Refund processing
- Transaction history

### 🎁 **Marketing & Promotions**
- Coupon system with advanced rules
- Discount types (%, fixed, free shipping)
- Usage limits & restrictions
- Price drop notifications

### 📊 **Analytics & Reporting**
- Admin dashboard with platform metrics
- Seller dashboard with sales analytics
- Revenue tracking & reports
- Top products & sellers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon DB recommended)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Add your DATABASE_URL and JWT_SECRET

# Run migrations (if needed)
npm run migration:run

# Start development server
npm run start:dev
```

Backend will be available at `http://localhost:4000`  
API Documentation: `http://localhost:4000/api/docs`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Add NEXT_PUBLIC_API_URL=http://localhost:4000

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
TezCart/
├── backend/          # NestJS Backend
│   ├── src/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── coupons/
│   │   ├── entities/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── products/
│   │   ├── sellers/
│   │   └── ... (16 modules total)
│   └── docs/
│
├── frontend/         # Next.js Frontend
│   ├── app/         # Pages (App Router)
│   ├── components/  # Reusable components
│   ├── services/    # API services
│   ├── hooks/       # React Query hooks
│   ├── lib/         # Utilities
│   └── types/       # TypeScript types
│
└── docs/            # Documentation
```

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (TypeORM)
- **Authentication**: JWT
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query
- **HTTP Client**: Axios

## 📊 Platform Statistics

- **Backend Modules**: 16
- **API Endpoints**: 112
- **Database Entities**: 24
- **Frontend Pages**: 10
- **UI Components**: 25+
- **Documentation**: 7 comprehensive guides

## 🎯 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Products
- `GET /products` - List products with filters
- `GET /products/:id` - Get product details
- `POST /products` - Create product (Seller)
- ... and 100+ more endpoints

Full API documentation available at `/api/docs` when running the backend.

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- SQL injection protection (TypeORM)
- XSS protection
- CORS configuration
- Rate limiting ready

## 📚 Documentation

- [API Reference](./docs/API_REFERENCE.md) - Complete API documentation
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Entity relationships
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Features List](./docs/FEATURES.md) - Complete feature breakdown
- [Integration Guide](./docs/INTEGRATION.md) - API integration examples

## 🚢 Deployment

### Recommended Hosting

**Backend:**
- Railway
- Render
- Fly.io
- AWS / Google Cloud

**Database:**
- Neon DB (Serverless PostgreSQL)
- Supabase
- AWS RDS

**Frontend:**
- Vercel (Recommended for Next.js)
- Netlify
- AWS Amplify

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🌟 Screenshots

<div align="center">
  <img src="./screenshots/homepage.png" alt="Homepage" width="800px" />
  <p><i>Beautiful homepage with featured products</i></p>
  
  <img src="./screenshots/products.png" alt="Product Listing" width="800px" />
  <p><i>Product listing with advanced filters</i></p>
  
  <img src="./screenshots/checkout.png" alt="Checkout" width="800px" />
  <p><i>Multi-step checkout flow</i></p>
</div>

## 🛠️ Development

### Run Tests
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

### Build for Production
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [NestJS](https://nestjs.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📧 Contact

For questions or support, please open an issue or contact the maintainers.

---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
