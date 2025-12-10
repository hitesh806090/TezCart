# 🔗 TezCart API Integration Guide

## ✅ Integration Complete!

The frontend is now fully connected to the backend with type-safe API services and React Query hooks.

## 📁 Structure

```
frontend/
├── services/           # API service functions
│   ├── auth.ts        # Authentication
│   ├── products.ts    # Products
│   ├── cart.ts        # Shopping cart
│   ├── orders.ts      # Orders
│   └── wishlist.ts    # Wishlist
└── hooks/             # React Query hooks
    ├── useAuth.ts     # Auth hooks
    ├── useProducts.ts # Product hooks
    ├── useCart.ts     # Cart hooks
    └── useWishlist.ts # Wishlist hooks
```

## 🚀 Usage Examples

### Authentication

```typescript
import { useLogin, useRegister, useLogout } from '@/hooks/useAuth'

function LoginForm() {
  const login = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    login.mutate({ 
      email: 'user@example.com', 
      password: 'password' 
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Products

```typescript
import { useProducts, useProduct } from '@/hooks/useProducts'

function ProductsList() {
  const { data, isLoading, error } = useProducts({ 
    page: 1, 
    limit: 20,
    categoryId: 'electronics' 
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading products</div>

  return (
    <div>
      {data?.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductDetail({ id }) {
  const { data: product, isLoading } = useProduct(id)
  
  if (isLoading) return <div>Loading...</div>

  return <div>{product?.name}</div>
}
```

### Shopping Cart

```typescript
import { useCart, useAddToCart, useUpdateCartItem } from '@/hooks/useCart'

function Cart() {
  const { data: cart } = useCart()
  const addToCart = useAddToCart()
  const updateItem = useUpdateCartItem()

  const handleAddToCart = (productId: string) => {
    addToCart.mutate({ productId, quantity: 1 })
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateItem.mutate({ itemId, quantity })
  }

  return (
    <div>
      <h2>Cart ({cart?.items.length} items)</h2>
      <p>Total: ${cart?.total}</p>
    </div>
  )
}
```

### Wishlist

```typescript
import { useWishlist, useAddToWishlist } from '@/hooks/useWishlist'

function WishlistButton({ productId }) {
  const addToWishlist = useAddToWishlist()
  const { data: wishlist } = useWishlist()

  const isInWishlist = wishlist?.items.some(
    item => item.productId === productId
  )

  const handleToggle = () => {
    addToWishlist.mutate({ 
      productId, 
      notifyOnPriceDrop: true 
    })
  }

  return (
    <button onClick={handleToggle}>
      {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </button>
  )
}
```

## 🎯 Features

### ✅ Type Safety
- Full TypeScript support
- Type-safe API responses
- Autocomplete in IDE

### ✅ Caching
- Automatic data caching
- Optimistic updates
- Background refetching

### ✅ Loading States
- `isLoading` - Initial load
- `isPending` - Mutation in progress
- `isError` - Error state

### ✅ Error Handling
- Automatic 401 redirect
- Error boundaries ready
- Retry logic

### ✅ Guest Support
- Guest cart with session ID
- Cart merge on login
- Persistent session

## 🔐 Authentication Flow

1. **Register** → Auto-redirect to login
2. **Login** → Store token & user → Redirect to home
3. **Logout** → Clear token & cache → Redirect to login
4. **401 Error** → Auto-logout & redirect

## 🛒 Shopping Flow

1. **Browse Products** → Filter & sort
2. **View Details** → Track view count
3. **Add to Cart** → Guest or user cart
4. **Apply Coupon** → Discount calculation
5. **Checkout** → Create order
6. **Payment** → Process payment
7. **Success** → Order confirmation

## 📦 Available Services

### Products API
- `getProducts()` - List with filters
- `getProduct(id)` - Single product
- `getTrending()` - Trending products
- `incrementView(id)` - Track view

### Auth API
- `register()` - New user
- `login()` - Authenticate
- `getProfile()` - Current user
- `updateProfile()` - Update user
- `changePassword()` - Password change

### Cart API
- `getCart()` - Get cart
- `addItem()` - Add product
- `updateItem()` - Update quantity
- `removeItem()` - Remove product
- `applyCoupon()` - Apply discount
- `removeCoupon()` - Remove discount
- `clearCart()` - Empty cart
- `mergeCart()` - Merge guest cart

### Wishlist API
- `getWishlist()` - Get saved items
- `addItem()` - Save product
- `removeItem()` - Remove product
- `moveToCart()` - Add to cart
- `moveAllToCart()` - Bulk add
- `checkInWishlist()` - Check status

### Orders API
- `checkout()` - Create order
- `getMyOrders()` - Order history
- `getOrder(id)` - Order details
- `getOrderByNumber()` - Track order
- `cancelOrder()` - Cancel order

## 🎨 React Query Benefits

1. **Automatic Caching** - No duplicate requests
2. **Background Updates** - Fresh data always
3. **Optimistic Updates** - Instant UI feedback
4. **Retry Logic** - Network resilience
5. **Pagination** - Built-in support
6. **Infinite Scroll** - Easy implementation

## 🔄 Cache Management

```typescript
import { useQueryClient } from '@tanstack/react-query'

function MyComponent() {
  const queryClient = useQueryClient()

  // Invalidate specific query
  queryClient.invalidateQueries({ queryKey: ['products'] })

  // Clear all cache
  queryClient.clear()

  // Set data manually
  queryClient.setQueryData(['product', id], newData)
}
```

## 🌐 Environment Setup

Ensure `.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## ✨ Best Practices

1. **Always use hooks** - Don't call services directly
2. **Handle loading states** - Show spinners/skeletons
3. **Handle errors** - Display user-friendly messages
4. **Optimistic updates** - Update UI before server response
5. **Invalidate cache** - After mutations
6. **Use query keys** - For proper caching

## 🐛 Troubleshooting

### 401 Errors
- Check token in localStorage
- Verify backend is running
- Check CORS settings

### Cache Issues
- Invalidate queries after mutations
- Check query keys match
- Clear cache if needed

### CORS Errors
- Add frontend URL to backend CORS config
- Check API URL in environment variables

---

**Frontend ↔ Backend Integration Complete!** ✅

All API calls are type-safe, cached, and optimized for performance.
