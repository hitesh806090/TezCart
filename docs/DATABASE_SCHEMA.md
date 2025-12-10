# 🗄️ Database Schema Documentation

## Overview

TezCart uses **PostgreSQL** with **TypeORM** for database management. The schema consists of 24 entities with comprehensive relationships.

## Entity Relationship Diagram

```
User ──┬─→ Seller (1:1)
       ├─→ Product (1:Many)
       ├─→ Review (1:Many)
       ├─→ Wishlist (1:1)
       ├─→ Cart (1:1)
       ├─→ Order (1:Many)
       ├─→ Address (1:Many)
       ├─→ Notification (1:Many)
       └─→ Payment (1:Many)

Product ─┬─→ Category (Many:1)
         ├─→ Review (1:Many)
         ├─→ ProductQuestion (1:Many)
         ├─→ CartItem (1:Many)
         └─→ OrderItem (1:Many)

Order ───┬─→ OrderItem (1:Many)
         └─→ Payment (1:Many)

Coupon ──→ CouponUsage (1:Many)

ProductQuestion ──→ ProductAnswer (1:Many)
```

## Core Entities

### 1. User
**Table**: `users`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR | Unique email |
| password | VARCHAR | Hashed password |
| name | VARCHAR | User's full name |
| phone | VARCHAR | Phone number |
| avatar | VARCHAR | Profile image URL |
| role | ENUM | customer, seller, admin |
| isEmailVerified | BOOLEAN | Email verification status |
| createdAt | TIMESTAMP | Account creation date |
| updatedAt | TIMESTAMP | Last update |

**Indexes**:
- `email` (unique)
- `createdAt`

**Relationships**:
- Has one `Seller`
- Has many `Products`
- Has many `Reviews`
- Has one `Wishlist`
- Has one `Cart`
- Has many `Orders`
- Has many `Addresses`
- Has many `Notifications`

---

### 2. Seller
**Table**: `sellers`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| shopName | VARCHAR | Shop name (unique) |
| shopSlug | VARCHAR | URL-friendly slug |
| description | TEXT | Shop description |
| logo | VARCHAR | Shop logo URL |
| banner | VARCHAR | Shop banner URL |
| businessName | VARCHAR | Legal business name |
| businessAddress | VARCHAR | Business address |
| businessPhone | VARCHAR | Business phone |
| businessEmail | VARCHAR | Business email |
| taxId | VARCHAR | Tax identification |
| gstNumber | VARCHAR | GST number (India) |
| bankDetails | JSON | Bank account details |
| rating | DECIMAL(3,2) | Average seller rating |
| totalReviews | INTEGER | Total review count |
| totalProducts | INTEGER | Product count |
| totalSales | INTEGER | Sales count |
| totalRevenue | DECIMAL(15,2) | Total revenue |
| tier | ENUM | bronze, silver, gold, platinum |
| status | ENUM | pending, approved, rejected, suspended |
| isActive | BOOLEAN | Active status |
| commissionRate | DECIMAL(5,2) | Platform commission % |
| approvedAt | TIMESTAMP | Approval date |

**Indexes**:
- `userId` (unique)
- `shopSlug` (unique)
- `status`

---

### 3. Product
**Table**: `products`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| sellerId | UUID | Foreign key to User |
| categoryId | UUID | Foreign key to Category |
| name | VARCHAR | Product name |
| slug | VARCHAR | URL slug |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Product price |
| compareAtPrice | DECIMAL(10,2) | Original price for discounts |
| costPerItem | DECIMAL(10,2) | Cost price |
| sku | VARCHAR | Stock keeping unit |
| barcode | VARCHAR | Product barcode |
| stockQuantity | INTEGER | Available stock |
| images | SIMPLE-ARRAY | Image URLs |
| brand | VARCHAR | Brand name |
| tags | SIMPLE-ARRAY | Search tags |
| attributes | JSON | Product attributes |
| status | ENUM | draft, active, inactive, out_of_stock |
| averageRating | DECIMAL(3,2) | Average rating |
| totalReviews | INTEGER | Review count |
| totalSales | INTEGER | Sales count |
| viewCount | INTEGER | View count |

**Indexes**:
- `sellerId`
- `categoryId`
- `slug` (unique)
- `sku`
- `status`

---

### 4. Category
**Table**: `categories`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Category name |
| slug | VARCHAR | URL slug |
| description | TEXT | Description |
| image | VARCHAR | Category image |
| parentId | UUID | Parent category (for hierarchy) |
| isActive | BOOLEAN | Active status |
| sortOrder | INTEGER | Display order |

**Indexes**:
- `slug` (unique)
- `parentId`

---

### 5. Review
**Table**: `reviews`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| productId | UUID | Foreign key to Product |
| userId | UUID | Foreign key to User |
| rating | INTEGER | 1-5 star rating |
| title | VARCHAR | Review title |
| comment | TEXT | Review text |
| images | SIMPLE-ARRAY | Review images |
| isVerifiedPurchase | BOOLEAN | Verified buyer |
| helpfulCount | INTEGER | Helpful votes |
| isPublished | BOOLEAN | Moderation status |

**Indexes**:
- `productId`
- `userId`
- `isPublished`

---

### 6. Wishlist & WishlistItem
**Table**: `wishlists`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User (unique) |
| shareToken | VARCHAR | Shareable link token |

**Table**: `wishlist_items`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| wishlistId | UUID | Foreign key to Wishlist |
| productId | UUID | Foreign key to Product |
| notifyOnPriceDrop | BOOLEAN | Price alert enabled |
| notifyOnBackInStock | BOOLEAN | Stock alert enabled |
| addedPrice | DECIMAL(10,2) | Price when added |

**Indexes**:
- `wishlistId`
- `productId`

---

### 7. Cart & CartItem
**Table**: `carts`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User (optional) |
| sessionId | VARCHAR | Guest session ID |
| couponCode | VARCHAR | Applied coupon |
| subtotal | DECIMAL(10,2) | Items subtotal |
| discount | DECIMAL(10,2) | Discount amount |
| tax | DECIMAL(10,2) | Tax amount |
| shipping | DECIMAL(10,2) | Shipping cost |
| total | DECIMAL(10,2) | Total amount |

**Table**: `cart_items`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| cartId | UUID | Foreign key to Cart |
| productId | UUID | Foreign key to Product |
| quantity | INTEGER | Item quantity |
| price | DECIMAL(10,2) | Unit price |
| productSnapshot | JSON | Product details snapshot |

**Indexes**:
- `userId`
- `sessionId`
- `cartId`

---

### 8. Order & OrderItem
**Table**: `orders`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| orderNumber | VARCHAR | Unique order number |
| userId | UUID | Foreign key to User |
| status | ENUM | pending, confirmed, processing, shipped, delivered, cancelled, refunded |
| paymentStatus | ENUM | pending, completed, failed, refunded |
| paymentMethod | ENUM | credit_card, upi, net_banking, wallet, cod |
| paymentTransactionId | VARCHAR | Payment transaction ID |
| shippingAddress | JSON | Shipping address |
| billingAddress | JSON | Billing address |
| subtotal | DECIMAL(10,2) | Items subtotal |
| tax | DECIMAL(10,2) | Tax amount |
| shippingCost | DECIMAL(10,2) | Shipping cost |
| discount | DECIMAL(10,2) | Discount amount |
| totalAmount | DECIMAL(10,2) | Total amount |
| couponCode | VARCHAR | Applied coupon |
| trackingNumber | VARCHAR | Shipping tracking |
| carrier | VARCHAR | Shipping carrier |
| paidAt | TIMESTAMP | Payment date |
| shippedAt | TIMESTAMP | Shipping date |
| deliveredAt | TIMESTAMP | Delivery date |

**Table**: `order_items`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Order |
| productId | UUID | Foreign key to Product |
| sellerId | UUID | Seller ID |
| quantity | INTEGER | Item quantity |
| price | DECIMAL(10,2) | Unit price (frozen) |
| discount | DECIMAL(10,2) | Item discount |
| subtotal | DECIMAL(10,2) | Item subtotal |
| productSnapshot | JSON | Product details |

**Indexes**:
- `userId`, `status`
- `orderNumber` (unique)
- `orderId`

---

### 9. Address
**Table**: `addresses`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| type | ENUM | home, work, other |
| fullName | VARCHAR | Recipient name |
| phone | VARCHAR | Contact phone |
| addressLine1 | VARCHAR | Address line 1 |
| addressLine2 | VARCHAR | Address line 2 |
| city | VARCHAR | City |
| state | VARCHAR | State/Province |
| postalCode | VARCHAR | Postal/ZIP code |
| country | VARCHAR | Country |
| isDefault | BOOLEAN | Default address |
| deliveryInstructions | TEXT | Delivery notes |

**Indexes**:
- `userId`

---

### 10. Coupon & CouponUsage
**Table**: `coupons`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| code | VARCHAR | Coupon code (unique) |
| description | TEXT | Description |
| discountType | ENUM | percentage, fixed_amount, free_shipping |
| discountValue | DECIMAL(10,2) | Discount value |
| minOrderAmount | DECIMAL(10,2) | Minimum order |
| maxDiscountAmount | DECIMAL(10,2) | Max discount cap |
| maxTotalUses | INTEGER | Total usage limit |
| maxUsesPerUser | INTEGER | Per-user limit |
| currentUses | INTEGER | Current usage count |
| validFrom | TIMESTAMP | Start date |
| validUntil | TIMESTAMP | End date |
| applicableCategories | SIMPLE-ARRAY | Category restrictions |
| applicableProducts | SIMPLE-ARRAY | Product restrictions |
| isFirstOrderOnly | BOOLEAN | First order only |
| status | ENUM | active, inactive, expired |

**Table**: `coupon_usage`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| couponId | UUID | Foreign key to Coupon |
| orderId | UUID | Foreign key to Order |
| discountAmount | DECIMAL(10,2) | Discount applied |
| usedAt | TIMESTAMP | Usage timestamp |

**Indexes**:
- `code` (unique)
- `userId`, `couponId`

---

### 11. Notification
**Table**: `notifications`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| type | ENUM | order_placed, order_shipped, price_drop, etc. |
| title | VARCHAR | Notification title |
| message | TEXT | Notification message |
| data | JSON | Additional data |
| actionUrl | VARCHAR | Action link |
| priority | ENUM | low, medium, high, urgent |
| isRead | BOOLEAN | Read status |
| readAt | TIMESTAMP | Read timestamp |
| isSent | BOOLEAN | Sent status (email/SMS) |
| sentAt | TIMESTAMP | Sent timestamp |

**Indexes**:
- `userId`, `isRead`
- `userId`, `createdAt`

---

### 12. ProductQuestion & ProductAnswer
**Table**: `product_questions`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| productId | UUID | Foreign key to Product |
| userId | UUID | Foreign key to User |
| question | TEXT | Question text |
| answerCount | INTEGER | Answer count |
| helpfulCount | INTEGER | Helpful votes |
| isPublished | BOOLEAN | Moderation status |
| hasAnswer | BOOLEAN | Has answers flag |

**Table**: `product_answers`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| questionId | UUID | Foreign key to ProductQuestion |
| userId | UUID | Foreign key to User |
| answer | TEXT | Answer text |
| isSellerAnswer | BOOLEAN | From seller |
| isVerifiedPurchase | BOOLEAN | Verified buyer |
| helpfulCount | INTEGER | Helpful votes |
| isPublished | BOOLEAN | Moderation status |

**Indexes**:
- `productId`, `isPublished`
- `questionId`

---

### 13. Payment
**Table**: `payments`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Order |
| userId | UUID | Foreign key to User |
| paymentMethod | ENUM | credit_card, upi, net_banking, wallet, cod |
| gateway | ENUM | stripe, razorpay, paypal, manual |
| status | ENUM | pending, processing, completed, failed, refunded |
| amount | DECIMAL(10,2) | Payment amount |
| currency | VARCHAR | Currency code |
| transactionId | VARCHAR | Gateway transaction ID |
| gatewayOrderId | VARCHAR | Gateway order reference |
| gatewayResponse | JSON | Gateway response data |
| cardLast4 | VARCHAR | Last 4 digits of card |
| cardBrand | VARCHAR | Card brand |
| refundedAmount | DECIMAL(10,2) | Refunded amount |
| refundReason | VARCHAR | Refund reason |
| failureReason | VARCHAR | Failure reason |
| paidAt | TIMESTAMP | Payment timestamp |

**Indexes**:
- `orderId`
- `userId`

---

## Database Migrations

TypeORM automatically syncs the schema in development. For production:

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Data Types Reference

| TypeORM Type | PostgreSQL Type |
|--------------|-----------------|
| UUID | uuid |
| VARCHAR | varchar |
| TEXT | text |
| INTEGER | integer |
| DECIMAL(10,2) | numeric(10,2) |
| BOOLEAN | boolean |
| TIMESTAMP | timestamp with time zone |
| JSON | jsonb |
| ENUM | enum |
| SIMPLE-ARRAY | text |

## Best Practices

1. **Always use UUIDs** for primary keys
2. **Index foreign keys** for performance
3. **Use enums** for fixed value sets
4. **JSON columns** for flexible data
5. **Timestamps** on all entities
6. **Soft deletes** where appropriate
7. **Cascading deletes** carefully

---

**Database Version**: PostgreSQL 14+  
**ORM**: TypeORM 0.3+
