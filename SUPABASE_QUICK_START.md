# Supabase Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Run Database Schema (2 min)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `wvptkawpgmccgsqjkwls`
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy entire content from `SUPABASE_DATABASE_SCHEMA.sql`
6. Click **Run**
7. ✅ Verify: Go to **Table Editor** - you should see 7 tables

### Step 2: Configure Storage (1 min)

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `products`
4. Make it **Public**
5. Click **Create bucket**
6. ✅ Done!

### Step 3: Enable Auth (1 min)

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Go to **URL Configuration**
4. Add your site URL: `http://localhost:8080`
5. ✅ Done!

### Step 4: Enable Realtime (1 min)

1. Go to **Database** → **Replication**
2. Enable replication for:
   - ✅ `products`
   - ✅ `orders`
   - ✅ `transactions`
3. Click **Save**
4. ✅ Done!

### Step 5: Start Development (30 sec)

```bash
npm install
npm run dev
```

Open http://localhost:8080

---

## 🎯 Test Your Setup

### 1. Sign Up
- Go to `/signup`
- Create a new account
- Check email for verification

### 2. Sign In
- Go to `/login`
- Sign in with your account
- ✅ You should be logged in

### 3. Admin Access
- Sign in with security code
- You'll be auto-promoted to admin
- Access `/admin-dashboard`

### 4. Create Product (Admin)
- Go to Admin Dashboard
- Click "Products"
- Add a new product
- Upload an image
- ✅ Product should appear in shop

### 5. Place Order (User)
- Go to `/shop`
- Add product to cart
- Checkout
- ✅ Order should appear in user dashboard

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data |
| `admin_users` | Admin permissions |
| `products` | Product catalog |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `transactions` | Payment records |
| `security_audit_log` | Security events |

---

## 🔑 Environment Variables

Already configured in `.env`:

```env
VITE_SUPABASE_URL=https://wvptkawpgmccgsqjkwls.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

---

## 🛠️ Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Key Features

- ✅ Email/Password Authentication
- ✅ Admin Role Management
- ✅ Product Management (CRUD)
- ✅ Order Management
- ✅ Real-time Updates
- ✅ Image Upload (Supabase Storage)
- ✅ Transaction Tracking
- ✅ Security Audit Logging
- ✅ Row Level Security (RLS)

---

## 🔒 Security

- **RLS Enabled**: All tables protected
- **User Isolation**: Users see only their data
- **Admin Access**: Controlled by `admin_users` table
- **Secure Storage**: Images in Supabase Storage
- **Audit Trail**: All actions logged

---

## 🐛 Troubleshooting

### Can't sign up?
- Check email provider is enabled
- Check site URL is configured

### Can't see products?
- Run database schema
- Check RLS policies

### Images not uploading?
- Create `products` storage bucket
- Make it public

### Real-time not working?
- Enable replication for tables
- Check browser console for errors

---

## 📚 Learn More

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Checklist

- [ ] Database schema created
- [ ] Storage bucket configured
- [ ] Auth provider enabled
- [ ] Realtime enabled
- [ ] Dev server running
- [ ] Can sign up/sign in
- [ ] Can create products (admin)
- [ ] Can place orders (user)
- [ ] Real-time updates working

---

## 🎉 You're Ready!

Your Legal Associates e-commerce platform is now running on Supabase!

**Next**: Deploy to production (see `VERCEL_DEPLOYMENT_GUIDE.md`)
