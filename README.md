# 🛒 TezCart - 3D eCommerce Marketplace Platform

A complete, production-ready 3D/AR eCommerce marketplace built with Next.js 15, TypeScript, tRPC, and Prisma.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-blue.svg)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/Prisma-6.3-blue.svg)](https://www.prisma.io/)

---

## 🎯 What is TezCart?

TezCart is a **fully-featured 3D eCommerce marketplace** that allows:
- **Customers** to browse and purchase products with interactive 3D/AR viewing
- **Sellers** to list products, manage inventory, and track sales
- **Admins** to oversee the platform, moderate content, and manage users

### ✨ Key Features

**🛍️ Customer Experience (18 Features)**
- Interactive 3D product viewer with AR Quick View
- Advanced search with filters and categories
- Shopping cart with coupon codes
- Secure checkout with saved addresses
- Order tracking and history
- Product reviews and ratings
- Wishlist and product comparison
- Customer-seller messaging
- Return requests
- Push notifications

**🏪 Seller Platform (18 Features)**
- Seller registration with KYC/KYB verification
- Store profile management
- Product creation wizard with 3D model upload
- Inventory management
- Order fulfillment dashboard
- Sales analytics and insights
- Discount coupon creation
- Customer messaging
- Return request handling
- Payout tracking

**⚙️ Admin Console (15 Features)**
- Seller application review and approval
- Platform statistics dashboard
- Order monitoring
- Product moderation
- User management
- Category management
- Content reporting and moderation
- Homepage CMS
- Fraud detection system
- Dispute resolution
- Returns oversight

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** or **pnpm**
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd tezcart

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env
# Edit .env with your configuration

# 4. Set up the database
npx prisma generate
npx prisma db push

# 5. (Optional) Seed initial data
npx prisma db seed

# 6. Start development server
npm run dev
```

Visit **http://localhost:3000** to see your application!

---

## 🔧 Environment Configuration

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/tezcart"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### Optional Variables (for full functionality)

```env
# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3 (for file storage)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Amazon SES (for emails)
SES_FROM_EMAIL="noreply@yourdomain.com"

# Elasticsearch (optional, for advanced search)
ELASTICSEARCH_URL="http://localhost:9200"
ELASTICSEARCH_API_KEY="your-api-key"
```

### Generate NEXTAUTH_SECRET

```bash
# On Unix/Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

---

## 📦 Database Setup

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tezcart;

# Create user (optional)
CREATE USER tezcart_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE tezcart TO tezcart_user;

# Exit
\q
```

### 3. Update DATABASE_URL

```env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://tezcart_user:your_password@localhost:5432/tezcart"
```

### 4. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations (production)
npx prisma migrate deploy
```

### 5. View Database (Optional)

```bash
npx prisma studio
```

This opens a GUI at **http://localhost:5555** to view and edit your database.

---

## 🏗️ Project Structure

```
tezcart/
├── prisma/
│   └── schema.prisma          # Database schema (33 models)
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── seller/            # Seller portal
│   │   ├── products/          # Product pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── orders/            # Order management
│   │   ├── messages/          # Messaging system
│   │   └── ...                # Other pages
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── header.tsx         # Main navigation
│   │   ├── model-viewer.tsx   # 3D viewer component
│   │   └── ...                # Other components
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/       # 24 tRPC routers
│   │   │   ├── root.ts        # API root
│   │   │   └── trpc.ts        # tRPC configuration
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── db.ts              # Prisma client
│   ├── trpc/                   # tRPC client setup
│   ├── lib/                    # Utility functions
│   └── env.ts                  # Environment validation
├── .env                        # Environment variables (create this)
├── .env.example               # Example environment file
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

---

## 📚 Technology Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 19** - UI library

### Backend
- **tRPC** - End-to-end type-safe APIs
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **NextAuth.js** - Authentication

### Frontend
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Beautiful component library
- **Lucide Icons** - Icon library
- **Google model-viewer** - 3D/AR viewer
- **React Query** - Data fetching (via tRPC)

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

---

## 🎨 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run dev:turbo    # Start with Turbopack (faster)

# Building
npm run build        # Create production build
npm start            # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
npx prisma migrate   # Run migrations

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Type Checking
npm run type-check   # Check TypeScript types
```

---

## 👥 User Roles & Access

The platform has 4 user roles with different access levels:

### 1. CUSTOMER (Default)
- Browse and search products
- View products in 3D/AR
- Add to cart and checkout
- Place orders
- Write reviews
- Request returns
- Message sellers
- Manage wishlist

### 2. SELLER
- All customer features, plus:
- Create and manage products
- Upload 3D models
- Manage inventory
- Fulfill orders
- Handle returns
- View analytics
- Create coupons
- Reply to customers

### 3. ADMIN
- Review and approve sellers
- Monitor all orders
- Moderate content
- Manage categories
- View platform statistics
- Handle disputes
- Review fraud alerts
- Manage homepage CMS

### 4. SUPER_ADMIN
- All admin features, plus:
- Full system access
- Manage other admins
- System configuration

---

## 🔐 First-Time Setup

### 1. Create First User

Visit **http://localhost:3000/auth/signup** and create an account.

### 2. Set User as Admin (via Database)

```bash
# Open Prisma Studio
npx prisma studio

# Navigate to User model
# Find your user
# Change role from "CUSTOMER" to "ADMIN"
# Save
```

Or via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 3. Access Admin Panel

Visit **http://localhost:3000/admin** to access the admin dashboard.

### 4. Create Categories

1. Go to **Admin → Categories**
2. Create product categories (e.g., Electronics, Furniture, Clothing)

### 5. Approve Sellers

1. Users can apply at **/seller/apply**
2. Admin reviews at **/admin/sellers**
3. Approve legitimate sellers

---

## 🌐 API Documentation

The platform uses **tRPC** for type-safe API calls. All endpoints are automatically typed.

### API Routers (24 total)

| Router | Endpoints | Description |
|--------|-----------|-------------|
| `auth` | 2 | Authentication & registration |
| `seller` | 6 | Seller onboarding & management |
| `product` | 6 | Product CRUD with 3D support |
| `cart` | 5 | Shopping cart operations |
| `order` | 6 | Order management |
| `review` | 6 | Reviews & ratings |
| `wishlist` | 4 | Wishlist management |
| `return` | 5 | Returns workflow |
| `message` | 5 | Customer-seller messaging |
| `analytics` | 2 | Sales analytics |
| `coupon` | 5 | Discount codes |
| `notification` | 5 | In-app notifications |
| `category` | 5 | Category management |
| `payment` | 4 | Payment methods |
| `address` | 5 | Address management |
| `tracking` | 3 | Order tracking |
| `report` | 4 | Content reporting |
| `favorite` | 4 | Favorite sellers |
| `search` | 3 | Global search |
| `subscription` | 3 | Newsletter |
| `activity` | 2 | User activity |
| `cms` | 6 | Homepage CMS |
| `fraud` | 5 | Fraud detection |
| `dispute` | 5 | Dispute resolution |

### Example API Call

```typescript
// In any React component
import { api } from "@/trpc/react";

function ProductList() {
  const { data: products } = api.product.getAll.useQuery({
    search: "laptop",
    category: "Electronics",
    minPrice: 500,
    maxPrice: 2000,
  });

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

---

## 🎭 3D/AR Features

### Supported 3D Formats

- **.glb** (Binary glTF)
- **.gltf** (JSON glTF)
- **.usdz** (Apple AR)

### Implementing 3D Viewer

The platform uses Google's `<model-viewer>` component:

```tsx
<ModelViewer
  src="/path/to/model.glb"
  iosSupported="/path/to/model.usdz"
  alt="Product 3D Model"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
/>
```

### AR Quick View

- **iOS**: Uses AR Quick Look (USDZ files)
- **Android**: Uses Scene Viewer (GLB files)
- **WebXR**: Browser-based AR

---

## 🔌 External Integrations

### AWS S3 (File Storage)

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET_NAME="tezcart-uploads"
```

**Setup:**
1. Create S3 bucket in AWS Console
2. Set bucket CORS policy
3. Create IAM user with S3 access
4. Add credentials to `.env`

### Stripe (Payments)

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Setup:**
1. Create Stripe account
2. Get API keys from Dashboard
3. Set up webhook endpoint at `/api/webhooks/stripe`
4. Add webhook secret to `.env`

### Amazon SES (Emails)

```env
SES_FROM_EMAIL="noreply@yourdomain.com"
AWS_SES_REGION="us-east-1"
```

**Setup:**
1. Verify domain in AWS SES
2. Create SMTP credentials
3. Configure in NextAuth

---

## 🐛 Troubleshooting

### Build Errors

**Error: Cannot find module 'autoprefixer'**
```bash
npm install -D autoprefixer postcss tailwindcss
```

**Error: Invalid environment variables**
```bash
# Make sure .env file exists with required variables
cp .env.example .env
# Edit .env and add DATABASE_URL and NEXTAUTH_SECRET
```

### Database Issues

**Error: Can't reach database server**
```bash
# Check PostgreSQL is running
# Windows:
Get-Service postgresql*

# Mac/Linux:
brew services list
sudo systemctl status postgresql
```

**Error: Database does not exist**
```bash
# Create database
psql -U postgres
CREATE DATABASE tezcart;
\q
```

### Development Server

**Port 3000 already in use**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill existing process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

## 📈 Performance Optimization

### Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={500}
  priority  // For above-the-fold images
/>
```

### 3D Model Optimization

- Keep poly count under 100k triangles
- Use texture compression (Basis/Draco)
- Optimize model size (< 5MB recommended)
- Use CDN for delivery

### Database Optimization

```prisma
// Add indexes in schema.prisma
@@index([sellerId])
@@index([status, createdAt])
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Set up PostgreSQL (Vercel Postgres or external)
```

### Docker

```dockerfile
# Dockerfile included in project
docker build -t tezcart .
docker run -p 3000:3000 tezcart
```

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- product.test.ts

# Coverage
npm run test:coverage
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

- **Documentation**: See this README
- **Issues**: Open an issue on GitHub
- **Email**: support@tezcart.com

---

## 🎉 Conclusion

You now have a fully-functional 3D eCommerce marketplace! 

**Next Steps:**
1. ✅ Complete environment configuration
2. ✅ Set up external services (S3, Stripe, SES)
3. ✅ Customize branding and styling
4. ✅ Add your products and sellers
5. ✅ Deploy to production

**Happy Selling! 🛒**

---

**Built with ❤️ using Next.js, TypeScript, and tRPC**
