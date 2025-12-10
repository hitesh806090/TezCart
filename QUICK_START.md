# TezCart - Quick Start Guide

## 🎯 Get Up and Running in 5 Minutes

### Step 1: Set Up Neon Database
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`)

### Step 2: Configure Backend

```bash
cd backend

# Create .env file
echo "DATABASE_URL=your-neon-connection-string-here
JWT_SECRET=my-super-secret-key-12345
JWT_EXPIRATION=7d
PORT=4000
FRONTEND_URL=http://localhost:3000" > .env

# Install dependencies (if not done already)
npm install

# Start the backend
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:4000
📚 Swagger docs available at: http://localhost:4000/api/docs
```

### Step 3: Configure Frontend

```bash
cd ../frontend

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=my-nextauth-secret-key-12345" > .env.local

# Install dependencies (if not done already)
npm install

# Start the frontend
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:   http://localhost:3000
```

### Step 4: Test the Login Page

1. Open http://localhost:3000/auth/login in your browser
2. You'll see a beautiful login form

### Step 5: Create a Test User (via Swagger or curl)

**Option A: Using Swagger UI**
1. Go to http://localhost:4000/api/docs
2. Find `POST /auth/register`
3. Click "Try it out"
4. Enter:
```json
{
  "email": "test@tezcart.com",
  "password": "test123456",
  "firstName": "Test",
  "lastName": "User"
}
```
5. Click "Execute"
6. Copy the `access_token` from the response

**Option B: Using curl**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@tezcart.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Step 6: Log In via Frontend

1. Go back to http://localhost:3000/auth/login
2. Enter:
   - Email: `test@tezcart.com`
   - Password: `test123456`
3. Click "Sign in"
4. On success, you'll be redirected to `/dashboard` (we'll build that next!)

## ✅ Verification Checklist

- [ ] Backend starts without errors on port 4000
- [ ] Swagger UI is accessible at http://localhost:4000/api/docs
- [ ] Frontend starts without errors on port 3000
- [ ] Login page renders with proper styling
- [ ] Can register a new user via Swagger
- [ ] Can log in via frontend with registered credentials
- [ ] JWT token is stored in localStorage after login

## 🐛 Troubleshooting

### Backend won't start
- Check your `DATABASE_URL` is correct
- Make sure Neon DB is accessible (test with `psql` or Neon console)
- Check for port 4000 conflicts: `netstat -ano | findstr :4000`

### Frontend won't start
- Clear `.next` folder: `rm -rf .next`
- Check for port 3000 conflicts: `netstat -ano | findstr :3000`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### CORS errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check browser console for specific CORS error messages

### Login fails
- Check backend logs for errors
- Verify user was created successfully in Swagger or Neon DB console
- Ensure `NEXT_PUBLIC_API_URL` in frontend matches backend URL

## 📖 What's Next?

After completing this quick start:

1. **Review the Blueprint** - See `docs/blueprint.md` for the full feature list
2. **Check Progress** - See `PROGRESS.md` for what's implemented
3. **Build Features** - Start with the product catalog or seller dashboard
4. **Add Tests** - Write unit and e2e tests for authentication

## 🎨 Customization

- Change colors in `frontend/tailwind.config.ts`
- Modify JWT expiration in backend `.env`
- Add more user roles in `backend/src/entities/user.entity.ts`
- Customize login page in `frontend/app/auth/login/page.tsx`

---

**Happy Coding! 🚀**
