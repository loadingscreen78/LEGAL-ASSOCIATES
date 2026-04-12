# ✅ Vercel Deployment Checklist

## 📋 Pre-Deployment (Do These First!)

### 1. Setup Supabase Database (Required!)
- [ ] Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/sql)
- [ ] Click "New Query"
- [ ] Copy entire content from `SUPABASE_DATABASE_SCHEMA.sql`
- [ ] Paste and click "Run"
- [ ] Verify: "Success. No rows returned"

### 2. Create Storage Bucket (Required!)
- [ ] Go to [Supabase Storage](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/storage/buckets)
- [ ] Click "New bucket"
- [ ] Name: `products`
- [ ] Toggle "Public bucket" ON
- [ ] Click "Create bucket"

### 3. Enable Realtime (Recommended)
- [ ] Go to [Supabase Replication](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/database/replication)
- [ ] Enable: `products`
- [ ] Enable: `orders`
- [ ] Enable: `transactions`
- [ ] Click "Save"

---

## 🚀 Vercel Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Import"

### Step 3: Configure Environment Variables

In the "Configure Project" screen, add these 2 variables:

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://wvptkawpgmccgsqjkwls.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cHRrYXdwZ21jY2dzcWprd2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTg4MDcsImV4cCI6MjA3OTEzNDgwN30.3oD6M9ACBus9Ls2dvpYpdmoRM5F5yZhZD00BrbnqIdY
Environments: ✅ Production ✅ Preview ✅ Development
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Click "Visit" to see your live site

---

## 🔧 Post-Deployment Configuration

### Update Supabase Site URL
1. Go to [Supabase URL Configuration](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/auth/url-configuration)
2. Add your Vercel domain (e.g., `your-app.vercel.app`)
3. Click "Save"

### Test Your Deployment
1. Visit your Vercel URL
2. Go to `/supabase-test`
3. Verify all tests pass ✅

---

## 📊 Environment Variables Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | `https://wvptkawpgmccgsqjkwls.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Public API key (safe for frontend) |

**Note**: Only 2 variables needed! Much simpler than Firebase (which needed 9).

---

## 🧪 Testing Checklist

After deployment, test these features:

### Authentication
- [ ] Sign up new user
- [ ] Verify email (check inbox)
- [ ] Sign in
- [ ] Sign out

### Admin Features
- [ ] Sign in with security code
- [ ] Access admin dashboard
- [ ] Create product
- [ ] Upload product image
- [ ] Update product
- [ ] Delete product

### User Features
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout
- [ ] Place order
- [ ] View order in dashboard
- [ ] Track order
- [ ] Download invoice

### Real-time Updates
- [ ] Create product (admin) → See in shop (user)
- [ ] Update order status (admin) → See in user dashboard
- [ ] All changes reflect instantly

---

## 🐛 Troubleshooting

### Build Fails
**Error**: "Module not found"
**Solution**: Run `npm install` locally and commit `package-lock.json`

### Environment Variables Not Working
**Error**: "Missing Supabase environment variables"
**Solution**: 
1. Check variable names are exact (case-sensitive)
2. Verify all environments are selected
3. Redeploy after adding variables

### Database Errors
**Error**: "relation does not exist"
**Solution**: Run `SUPABASE_DATABASE_SCHEMA.sql` in Supabase

### Storage Errors
**Error**: "Storage bucket not found"
**Solution**: Create `products` bucket in Supabase Storage

### Auth Errors
**Error**: "Invalid site URL"
**Solution**: Add Vercel domain to Supabase URL Configuration

---

## 🎯 Quick Reference

### Supabase Dashboard Links
- [SQL Editor](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/sql)
- [Storage](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/storage/buckets)
- [Authentication](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/auth/users)
- [Database](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/database/tables)
- [URL Config](https://supabase.com/dashboard/project/wvptkawpgmccgsqjkwls/auth/url-configuration)

### Vercel Dashboard
- [Projects](https://vercel.com/dashboard)
- [Deployments](https://vercel.com/dashboard)

---

## ✅ Final Checklist

Before going live:

- [ ] Database schema created
- [ ] Storage bucket created
- [ ] Realtime enabled
- [ ] Environment variables added to Vercel
- [ ] Deployed successfully
- [ ] Vercel domain added to Supabase
- [ ] `/supabase-test` passes all tests
- [ ] Can sign up/sign in
- [ ] Can create products (admin)
- [ ] Can place orders (user)
- [ ] Real-time updates working
- [ ] Images uploading correctly
- [ ] Invoices downloading correctly

---

## 🎉 You're Live!

Once all checklist items are complete, your Legal Associates e-commerce platform is live on Vercel!

**Share your site**: `https://your-app.vercel.app`

**Admin access**: Sign in with security code to become admin

**Need help?** Check `/supabase-test` for diagnostics
