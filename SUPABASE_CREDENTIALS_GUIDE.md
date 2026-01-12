# 🔑 Supabase Credentials Setup Guide

## Current Issue
The Supabase anon key you provided (`sb-publishable_TojwsqgPxC1UnUZaFWTjg_TvuEpbce`) is **NOT** a valid Supabase anon key format.

Valid Supabase anon keys are JWT tokens that look like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2cHRrYXdwZ21jY2dzcWprd2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzI2NzAsImV4cCI6MjA1MDAwODY3MH0.XXXXXXXXXXXXXXXXXXXXXXXX
```

## How to Get Correct Credentials

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Login to your account
3. Select your project: **wvptkawpgmccgsqjkwls**

### Step 2: Get API Keys
1. In the left sidebar, click **"Project Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. You'll see two sections:

#### Project URL
```
https://wvptkawpgmccgsqjkwls.supabase.co
```
✅ This is correct!

#### Project API keys
You'll see two keys:

**anon/public key** (this is what we need):
- Starts with `eyJ...`
- This is safe to use in your frontend
- Copy this entire key

**service_role key** (DO NOT USE):
- Also starts with `eyJ...`
- This bypasses all security rules
- Never use this in frontend code

### Step 3: Update the Code

Once you have the correct **anon key**, update `src/lib/supabaseClient.ts`:

```typescript
const SUPABASE_URL = 'https://wvptkawpgmccgsqjkwls.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ACTUAL_ANON_KEY_HERE'; // Paste the anon key here
```

## Setup Supabase Storage

### Step 1: Create Storage Bucket
1. In Supabase Dashboard, click **"Storage"** in left sidebar
2. Click **"New bucket"**
3. Bucket name: `products`
4. Make it **Public** (check the box)
5. Click **"Create bucket"**

### Step 2: Set Storage Policies
1. Click on the `products` bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**

#### Policy 1: Allow Public Read
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition:
```sql
true
```
- Click **"Review"** then **"Save policy"**

#### Policy 2: Allow Authenticated Upload
- Click **"New Policy"** again
- Policy name: `Authenticated users can upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition:
```sql
true
```
- Click **"Review"** then **"Save policy"**

#### Policy 3: Allow Authenticated Delete
- Click **"New Policy"** again
- Policy name: `Authenticated users can delete`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- Policy definition:
```sql
true
```
- Click **"Review"** then **"Save policy"**

## Testing the Setup

### Step 1: Update Credentials
1. Get your real anon key from Supabase Dashboard
2. Update `src/lib/supabaseClient.ts` with the correct key
3. Save the file

### Step 2: Test Image Upload
1. Login as admin: http://localhost:8081/login
2. Go to Admin Dashboard → Products
3. Click "Add Product"
4. Fill in product details
5. Upload an image
6. Click "Create Product"

### Step 3: Check Browser Console
Look for these logs:
- `📤 Uploading image to Supabase Storage...`
- `✅ Image uploaded successfully: https://wvptkawpgmccgsqjkwls.supabase.co/storage/v1/object/public/products/...`

### Step 4: Verify in Supabase
1. Go to Supabase Dashboard → Storage → products bucket
2. You should see your uploaded image file
3. Click on it to preview

## Troubleshooting

### Error: "Invalid API key"
**Solution**: You're using the wrong key format. Get the correct anon key from Project Settings → API.

### Error: "Bucket not found"
**Solution**: Create the `products` bucket in Storage section.

### Error: "Permission denied"
**Solution**: Set up the storage policies as described above.

### Error: "Failed to upload"
**Solution**: 
1. Check browser console for detailed error
2. Verify bucket is public
3. Verify storage policies are set correctly
4. Make sure you're logged in as admin

## Current Configuration

### What's Using Supabase:
- ✅ Product images (Storage)

### What's Using Firebase:
- ✅ Authentication (Auth)
- ✅ Products data (Firestore)
- ✅ Orders (Firestore)
- ✅ Transactions (Firestore)
- ✅ User profiles (Firestore)
- ✅ Admin users (Firestore)

## Next Steps

1. **Get your real Supabase anon key** from the dashboard
2. **Update `src/lib/supabaseClient.ts`** with the correct key
3. **Create the `products` bucket** in Supabase Storage
4. **Set up storage policies** as described above
5. **Test image upload** through admin panel

Once you provide the correct anon key, everything will work perfectly!
