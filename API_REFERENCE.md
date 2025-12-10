# TezCart API Reference

Base URL: `http://localhost:4000`

Swagger Documentation: `http://localhost:4000/api/docs`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer"  // Optional: customer | seller | delivery_partner | admin
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "isEmailVerified": false,
    "isActive": true
  },
  "access_token": "jwt-token"
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

---

## Categories Endpoints

### Get All Categories
**GET** `/categories`

**Query Parameters:**
- `includeInactive` (optional): `true` | `false` - Include inactive categories

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Electronics",
    "slug": "electronics",
    "description": "All electronic items",
    "imageUrl": "https://...",
    "parentId": null,
    "isActive": true,
    "displayOrder": 1,
    "createdAt": "2025-12-10T...",
    "updatedAt": "2025-12-10T...",
    "children": [...]
  }
]
```

### Get Root Categories
**GET** `/categories/root`

Returns all categories without a parent.

### Get Category by ID
**GET** `/categories/:id`

### Get Category by Slug
**GET** `/categories/slug/:slug`

### Get Category Children
**GET** `/categories/:id/children`

Returns all direct child categories.

### Create Category 🔒
**POST** `/categories`

**Requires:** JWT Authentication (Admin only)

**Body:**
```json
{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "imageUrl": "https://...",
  "parentId": "electronics-category-uuid",  // Optional
  "displayOrder": 1,  // Optional
  "isActive": true  // Optional
}
```

### Update Category 🔒
**PATCH** `/categories/:id`

**Requires:** JWT Authentication (Admin only)

**Body:** Same as Create (all fields optional)

### Delete Category 🔒
**DELETE** `/categories/:id`

**Requires:** JWT Authentication (Admin only)

**Note:** Cannot delete categories with subcategories.

---

## Products Endpoints

### Get All Products
**GET** `/products`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` - Search in product name
- `categoryId` - Filter by category UUID
- `sellerId` - Filter by seller UUID
- `status` - Filter by status: `draft` | `active` | `inactive` | `out_of_stock`
- `brand` - Filter by brand name
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` (default: `createdAt`) - Sort field
- `sortOrder` (default: `DESC`) - `ASC` | `DESC`
- `isFeatured` - Filter featured products: `true` | `false`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "description": "...",
      "shortDescription": "...",
      "price": 999.99,
      "compareAtPrice": 1099.99,
      "stockQuantity": 50,
      "sku": "IPH15PRO-BLK-256",
      "images": ["url1", "url2"],
      "brand": "Apple",
      "status": "active",
      "averageRating": 4.5,
      "totalReviews": 120,
      "totalSales": 450,
      "viewCount": 1234,
      "isFeatured": true,
      "category": {...},
      "seller": {...},
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### Get Featured Products
**GET** `/products/featured`

**Query Parameters:**
- `limit` (default: 10)

### Get Product by ID
**GET** `/products/:id`

**Note:** Increments view count automatically

### Get Product by Slug
**GET** `/products/slug/:slug`

**Note:** Increments view count automatically

### Get Related Products
**GET** `/products/:id/related`

**Query Parameters:**
- `limit` (default: 5)

Returns products from the same category.

### Create Product 🔒
**POST** `/products`

**Requires:** JWT Authentication (Seller/Admin only)

**Body:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple iPhone with A17 Pro chip",
  "shortDescription": "Flagship iPhone",
  "price": 999.99,
  "compareAtPrice": 1099.99,
  "costPrice": 800.00,
  "stockQuantity": 50,
  "sku": "IPH15PRO-BLK-256",
  "trackInventory": true,
  "lowStockThreshold": 10,
  "images": ["https://...", "https://..."],
  "brand": "Apple",
  "weight": 200,
  "dimensions": {
    "length": 15,
    "width": 7.5,
    "height": 0.8,
    "unit": "cm"
  },
  "attributes": {
    "color": "Black",
    "storage": "256GB",
    "processor": "A17 Pro"
  },
  "metaTitle": "iPhone 15 Pro - Best Price",
  "metaDescription": "Buy iPhone 15 Pro at the best price...",
  "tags": ["smartphone", "apple", "iphone"],
  "status": "active",
  "categoryId": "uuid",
  "isFeatured": false
}
```

**Note:** `sellerId` is automatically set from the authenticated user.

### Update Product 🔒
**PATCH** `/products/:id`

**Requires:** JWT Authentication (Seller/Admin only)

**Authorization:** Must be the product owner or admin

**Body:** Same as Create (all fields optional)

### Delete Product 🔒
**DELETE** `/products/:id`

**Requires:** JWT Authentication (Seller/Admin only)

**Authorization:** Must be the product owner or admin

### Update Stock 🔒
**PATCH** `/products/:id/stock`

**Requires:** JWT Authentication (Seller/Admin only)

**Body:**
```json
{
  "quantity": 100
}
```

**Note:** Automatically updates product status based on stock level.

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Notes

### Auto-Generated Fields

#### Products:
- `slug` - Auto-generated from product name
- `sellerId` - Set from authenticated user
- `status` - Auto-updated based on stock when `trackInventory` is true
- `viewCount` - Incremented on product views

#### Categories:
- `slug` - Auto-generated from category name

### Authorization Rules

#### Products:
- **Create:** Requires seller or admin role
- **Update:** Must be product owner or admin
- **Delete:** Must be product owner or admin
- **View:** Public (no authentication required)

#### Categories:
- **Create/Update/Delete:** Admin only
- **View:** Public (no authentication required)

### Circular Reference Prevention

Categories prevent circular parent-child relationships. Attempting to create a circular reference will result in a `400 Bad Request` error.

### Stock Management

When `trackInventory` is `true`:
- Product status automatically becomes `out_of_stock` when quantity reaches 0
- Product status automatically becomes `active` when stock is replenished (if previously out of stock)

---

**For interactive API testing, visit:** http://localhost:4000/api/docs
