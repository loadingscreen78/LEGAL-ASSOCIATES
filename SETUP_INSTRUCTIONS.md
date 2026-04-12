# 🚀 Setup Instructions - Legal Associates E-commerce

## ✅ Environment Variables Configured

Your Supabase keys are already configured in `.env`:

```env
VITE_SUPABASE_URL=https://wvptkawpgmccgsqjkwls.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Quick Setup (5 Minutes)

### Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

### Step 2: Setup Supabase Database (2 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open `SUPABASE_DATABASE_SCHEMA.sql` in your project
5. Copy the entire content
6. Paste into Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. ✅ Wait for "Success. No rows returned"

### Step 3: Create Storage Bucket (1 minute)

1. In Supabase Dashboard, click **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `products`
4. Make it **Public** (toggle the switch)
5. Click **Create bucket**
6. ✅ Done!

### Step 4: Enable Authentication (30 seconds)

1. In Supabase Dashboard, click **Authentication** → **Providers**
2. Verify **Email** is enabled (should be by default)
3. Go to **URL Configuration**
4. Add site URL: `http://localhost:8080`
5. Click **Save**
6. ✅ Done!

### Step 5: Enable Realtime (1 minute)

1. In Supabase Dashboard, click **Database** → **Replication**
2. Find and enable these tables:
   - ✅ `products`
   - ✅ `orders`
   - ✅ `transactions`
3. Click **Save**
4. ✅ Done!

### Step 6: Start Development Server (30 seconds)

```bash
npm run dev
```

The app will open at: http://localhost:8080

---

## 🧪 Test Your Setup

### Automatic Test Page

Visit: **http://localhost:8080/supabase-test**

This page will automatically test:
- ✅ Connection to Supabase
- ✅ Authentication service
- ✅ Database access
- ✅ Storage bucket

If all tests pass, you're ready to go! 🎉

### Manual Testing

1. **Sign Up**: Go to `/login` → Create account
2. **Sign In**: Login with your account
3. **Admin Access**: Login with security code (auto-promoted to admin)
4. **Create Product**: Admin Dashboard → Products → Add Product
5. **Upload Image**: Add product image
6. **Place Order**: Shop → Add to cart → Checkout

---

## 📊 Database Tables Created

| Table | Purpose | Records |
|-------|---------|---------|
| `profiles` | User profiles | Auto-created on signup |
| `admin_users` | Admin permissions | Created on first admin login |
| `products` | Product catalog | Empty (add via admin) |
| `orders` | Customer orders | Empty (created on checkout) |
| `order_items` | Order line items | Empty (created with orders) |
| `transactions` | Payment records | Empty (created on payment) |
| `security_audit_log` | Security events | Auto-populated |

---

## 🔑 API Keys Explained

### Publishable Key (Anon Key)
- ✅ Safe to use in frontend
- ✅ Protected by Row Level Security (RLS)
- ✅ Already configured in `.env`

### Secret Key (Service Role)
- ❌ Never use in frontend
- ❌ Bypasses RLS
- ❌ Keep it secret!

### JWT Signing Keys
- Used internally by Supabase
- No action needed

---

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only see their own data
- Admins can see all data
- Public can see active products only

### Admin System
- First user with security code becomes admin
- Admin level: `super_admin`
- Can manage products, orders, transactions

### Audit Logging
- All login attempts logged
- Admin actions tracked
- Security events recorded

---

## 🎯 Key Features

### Authentication
- ✅ Email/Password signup
- ✅ Email verification
- ✅ Session management
- ✅ Admin role system

### Products
- ✅ CRUD operations
- ✅ Image upload (Supabase Storage)
- ✅ Category filtering
- ✅ Stock management
- ✅ Real-time updates

### Orders
- ✅ Order placement
- ✅ Status tracking
- ✅ Estimated delivery
- ✅ Invoice generation (PDF)
- ✅ Real-time updates

### Admin Dashboard
- ✅ Product management
- ✅ Order management
- ✅ Transaction tracking
- ✅ Revenue statistics
- ✅ Real-time updates

---

## 🐛 Troubleshooting

### "relation does not exist" error
**Solution**: Run `SUPABASE_DATABASE_SCHEMA.sql` in SQL Editor

### "Storage bucket not found" error
**Solution**: Create `products` bucket in Storage section

### "JWT expired" error
**Solution**: Supabase auto-refreshes tokens. If persists, clear browser cache.

### Images not uploading
**Solution**: 
1. Check `products` bucket exists
2. Verify bucket is public
3. Check storage policies in schema

### Real-time not working
**Solution**: Enable replication for tables in Database → Replication

### Can't sign up
**Solution**: 
1. Check email provider is enabled
2. Verify site URL is configured
3. Check browser console for errors

---

## 📁 Project Structure

```
legal-luminance-design/
├── src/
│   ├── lib/
│   │   ├── supabaseClient.ts      # Supabase configuration
│   │   └── supabaseTest.ts        # Connection tests
│   ├── hooks/
│   │   ├── useAuth.ts             # Authentication hook
│   │   ├── useProducts.ts         # Products hook
│   │   ├── useOrders.ts           # Orders hook
│   │   └── useTransactions.ts     # Transactions hook
│   ├── pages/
│   │   └── SupabaseTest.tsx       # Test page
│   └── ...
├── SUPABASE_DATABASE_SCHEMA.sql   # Database schema
├── SUPABASE_QUICK_START.md        # Quick start guide
├── SUPABASE_MIGRATION_GUIDE.md    # Detailed guide
├── .env                           # Environment variables
└── package.json                   # Dependencies
```

---

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

See `VERCEL_DEPLOYMENT_GUIDE.md` for details.

---

## 📚 Documentation

- `SUPABASE_QUICK_START.md` - Quick setup guide
- `SUPABASE_MIGRATION_GUIDE.md` - Detailed migration info
- `SUPABASE_DATABASE_SCHEMA.sql` - Complete database schema
- `MIGRATION_COMPLETE.md` - Migration summary
- `VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions

---

## 🆘 Need Help?

### Check These First:
1. Visit `/supabase-test` to run automatic tests
2. Check browser console for errors
3. Check Supabase Dashboard logs
4. Review documentation files

### Resources:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

## ✅ Setup Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Database schema created (SQL Editor)
- [ ] Storage bucket created (`products`)
- [ ] Authentication enabled (Email provider)
- [ ] Realtime enabled (products, orders, transactions)
- [ ] Dev server running (`npm run dev`)
- [ ] Test page passed (`/supabase-test`)
- [ ] Can sign up/sign in
- [ ] Can create products (admin)
- [ ] Can place orders (user)

---

## 🎉 You're Ready!

Once all checklist items are complete, your Legal Associates e-commerce platform is fully operational!

**Next Steps:**
1. Create your admin account
2. Add products
3. Test the complete flow
4. Deploy to production

**Happy coding!** 🚀
