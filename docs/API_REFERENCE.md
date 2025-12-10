# 📚 TezCart API Reference

Complete API documentation for all 112 endpoints.

## Base URL
```
http://localhost:4000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Auth Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Profile Management (5 endpoints)

### Get Profile
```http
GET /profile
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890"
}
```

### Change Password
```http
PATCH /profile/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

## Products (9 endpoints)

### Create Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "categoryId": "category-uuid",
  "stockQuantity": 100,
  "images": ["image1.jpg", "image2.jpg"],
  "brand": "Brand Name",
  "sku": "SKU123"
}
```

### Get All Products
```http
GET /products?page=1&limit=20&categoryId=uuid&minPrice=10&maxPrice=100
```

### Get Product by ID
```http
GET /products/:id
```

### Update Product
```http
PATCH /products/:id
Authorization: Bearer <token>
```

### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Get My Products (Seller)
```http
GET /products/seller/my-products?page=1&limit=20
Authorization: Bearer <token>
```

### Track Product View
```http
POST /products/:id/increment-view
```

### Bulk Update Status
```http
PATCH /products/bulk/update-status
Authorization: Bearer <token>
Content-Type: application/json

{
  "productIds": ["uuid1", "uuid2"],
  "status": "active"
}
```

## Shopping Cart (9 endpoints)

### Add to Cart
```http
POST /cart/items
Authorization: Bearer <token> OR X-Session-ID: <session-id>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2
}
```

### Get Cart
```http
GET /cart
Authorization: Bearer <token> OR X-Session-ID: <session-id>

Response:
{
  "id": "cart-uuid",
  "items": [...],
  "subtotal": 199.98,
  "tax": 20.00,
  "shipping": 10.00,
  "discount": 0,
  "total": 229.98
}
```

### Update Cart Item
```http
PATCH /cart/items/:id
Content-Type: application/json

{
  "quantity": 3
}
```

### Apply Coupon
```http
POST /cart/coupon
Content-Type: application/json

{
  "couponCode": "SAVE20"
}
```

### Merge Cart (on login)
```http
POST /cart/merge
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "guest-session-id"
}
```

## Orders (9 endpoints)

### Checkout
```http
POST /orders/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "couponCode": "SAVE20"
}
```

### Get My Orders
```http
GET /orders/my-orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>
```

### Update Order Status (Seller/Admin)
```http
PATCH /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

### Add Tracking
```http
POST /orders/:id/tracking
Authorization: Bearer <token>
Content-Type: application/json

{
  "trackingNumber": "TRACK123",
  "carrier": "FedEx"
}
```

### Cancel Order
```http
POST /orders/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

## Sellers (11 endpoints)

### Register as Seller
```http
POST /sellers/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "shopName": "TechStore",
  "businessName": "TechStore Pvt Ltd",
  "businessAddress": "123 Business St",
  "businessPhone": "+1234567890",
  "businessEmail": "business@techstore.com",
  "bankDetails": {
    "accountHolder": "John Doe",
    "accountNumber": "1234567890",
    "bankName": "State Bank",
    "ifscCode": "SBIN0001234",
    "branch": "Main Branch"
  }
}
```

### Get My Shop
```http
GET /sellers/my-shop
Authorization: Bearer <token>
```

### Approve Seller (Admin)
```http
POST /sellers/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "commissionRate": 10
}
```

## Analytics (3 endpoints)

### Admin Dashboard
```http
GET /analytics/admin/dashboard?dateFrom=2025-01-01&dateTo=2025-12-31
Authorization: Bearer <token>

Response:
{
  "overview": {
    "totalOrders": 1000,
    "totalRevenue": 50000,
    "totalProducts": 500,
    "totalUsers": 2000
  },
  "charts": {
    "revenueByDay": [...],
    "ordersByStatus": [...]
  },
  "topProducts": [...],
  "topSellers": [...]
}
```

### Seller Dashboard
```http
GET /analytics/seller/dashboard?dateFrom=2025-01-01&dateTo=2025-12-31
Authorization: Bearer <token>
```

### Sales Report
```http
GET /analytics/sales-report?dateFrom=2025-01-01&dateTo=2025-12-31
Authorization: Bearer <token>
```

## Payments (6 endpoints)

### Create Payment
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-uuid",
  "paymentMethod": "credit_card"
}
```

### Process Payment
```http
POST /payments/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentId": "payment-uuid",
  "transactionId": "TXN123"
}
```

### Refund Payment (Admin)
```http
POST /payments/:id/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "reason": "Customer requested refund"
}
```

## Search (4 endpoints)

### Advanced Search
```http
GET /search?q=laptop&minPrice=500&maxPrice=2000&brand=Apple&sortBy=price_low&page=1
```

### Auto-complete Suggestions
```http
GET /search/suggestions?q=lap
```

### Popular Searches
```http
GET /search/popular?limit=10
```

### Trending Products
```http
GET /search/trending?limit=10
```

## Coupons (8 endpoints)

### Create Coupon (Admin)
```http
POST /coupons
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE20",
  "description": "Save 20% on all orders",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderAmount": 50,
  "maxDiscountAmount": 100,
  "validFrom": "2025-01-01T00:00:00Z",
  "validUntil": "2025-12-31T23:59:59Z"
}
```

### Validate Coupon
```http
POST /coupons/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE20",
  "orderAmount": 150
}

Response:
{
  "valid": true,
  "discount": 30.00,
  "message": "Coupon is valid"
}
```

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Rate Limiting

- **Default**: 100 requests per minute
- **Auth endpoints**: 5 requests per minute

## Pagination

Most list endpoints support pagination:

```
?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

For complete interactive documentation, visit: http://localhost:4000/api/docs
