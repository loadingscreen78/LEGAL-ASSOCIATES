# 🔥 + 🗄️ Hybrid Firebase + Supabase Setup

## Architecture Overview

### Firebase (Auth + Database)
- ✅ **Authentication**: User login, admin login, session management
- ✅ **Firestore Database**: Products, orders, transactions, profiles, admin_users
- ✅ **Real-time Updates**: Live sync between admin and user portal

### Supabase (Image Storage Only)
- ✅ **Storage**: Product images stored in `products` bucket
- ✅ **Public Access**: Images accessible via public URLs
- ✅ **CDN**: Fast image delivery

## Current Status

### ✅ Completed
1. Firebase authentication working
2. Firebase Firestore database working
3. Real-time listeners implemented
4. User portal pages ready (Shop, Books, Journals)
5. Admin dashboard ready
6. Supabase Storage integration code ready

### ⚠️ Needs Your Action
1. **Get correct Supabase anon key** (current key is invalid)
2. **Update `src/lib/supabaseClient.ts`** with real anon key
3. **Create `products` bucket** in Supabase Storage
4. **Set storage policies** for public read and authenticated write
5. **Add products** through admin panel

## Quick Start Guide

### Step 1: Fix Supabase Credentials (5 minutes)
1. Go to https://supabase.com/dashboard
2. Select project: `wvptkawpgmccgsqjkwls`
3. Go to Settings → API
4. Copy the **anon/public** key (starts with `eyJ...`)
5. Open `src/lib/supabaseClient.ts`
6. Replace `REPLACE_WITH_YOUR_ACTUAL_ANON_KEY` with your real key
7. Save the file

### Step 2: Setup Supabase Storage (5 minutes)
1. In Supabase Dashboard, go to Storage
2. Create new bucket: `products` (make it public)
3. Set policies:
   - Public read: Allow SELECT for public
   - Authenticated upload: Allow INSERT for authenticated
   - Authenticated delete: Allow DELETE for authenticated

### Step 3: Add Products (10 minutes)
1. Go to http://localhost:8081/login
2. Login as admin
3. Go to Admin Dashboard → Products
4. Click "Add Product"
5. Fill details and upload image
6. Save

### Step 4: Verify Everything Works
1. Check `/debug` page - Should show your products
2. Check `/books` - Should show books category
3. Check `/journals` - Should show journals category
4. Check `/shop` - Should show all products
5. Images should load from Supabase

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase config (auth + firestore)
│   └── supabaseClient.ts    # Supabase config (storage only)
├── hooks/
│   ├── useAuth.ts           # Firebase auth
│   ├── useProducts.ts       # Firestore + Supabase images
│   ├── useOrders.ts         # Firestore
│   └── useTransactions.ts   # Firestore
└── pages/
    ├── Shop.tsx             # User portal - all products
    ├── Books.tsx            # User portal - books only
    ├── Journals.tsx         # User portal - journals only
    └── AdminDashboardNew.tsx # Admin panel
```

## How Image Upload Works

1. Admin uploads image in admin panel
2. `useProducts.uploadProductImage()` is called
3. Image is uploaded to **Supabase Storage** (`products` bucket)
4. Supabase returns public URL
5. URL is saved to **Firebase Firestore** (product document)
6. User portal fetches product from Firestore
7. Image loads from Supabase URL

## Benefits of This Setup

### Firebase Benefits
- ✅ Free authentication
- ✅ Real-time database updates
- ✅ Easy security rules
- ✅ Good for structured data

### Supabase Benefits
- ✅ Better for file storage
- ✅ Built-in CDN
- ✅ Public URLs for images
- ✅ Easy to manage files

## Troubleshooting

### Images not uploading?
1. Check browser console for errors
2. Verify Supabase anon key is correct (starts with `eyJ`)
3. Verify `products` bucket exists
4. Verify storage policies are set

### Products not showing?
1. Go to `/debug` to check Firebase
2. Make sure products exist in Firestore
3. Make sure products are active (`is_active = true`)
4. Check category matches the page

### Real-time updates not working?
1. Check browser console for Firebase errors
2. Verify Firestore rules allow read access
3. Make sure you're logged in

## Next Steps

1. **Read `SUPABASE_CREDENTIALS_GUIDE.md`** for detailed Supabase setup
2. **Read `USER_PORTAL_FIX_GUIDE.md`** for adding products
3. **Get your Supabase anon key** and update the code
4. **Create storage bucket** and set policies
5. **Add products** and test everything

## Support

If you see these errors:
- `❌ SUPABASE SETUP ERROR: Invalid or missing anon key!` → Update anon key
- `Bucket not found` → Create `products` bucket
- `Permission denied` → Set storage policies
- `No products found` → Add products through admin panel

Everything is ready to go - just need to complete the Supabase setup!
