# Supabase Storage Setup for Product Images

## ✅ What's Done

- ✅ Installed `@supabase/supabase-js`
- ✅ Created `src/lib/supabaseClient.ts` with upload functions
- ✅ Updated `useProducts.ts` to use Supabase Storage
- ✅ Removed Firebase Storage references
- ✅ Firebase Auth and Firestore remain unchanged

## 🔧 Configuration Steps

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 2: Update Supabase Client

Open `src/lib/supabaseClient.ts` and replace:

```typescript
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual credentials:

```typescript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 3: Create Storage Bucket in Supabase

1. Go to Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Bucket name: `products`
4. Make it **Public** (check the public checkbox)
5. Click **"Create bucket"**

### Step 4: Set Storage Policies

Go to **Storage** → **Policies** → **products** bucket

**Policy 1: Allow Public Read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );
```

**Policy 2: Allow Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'products' AND auth.role() = 'authenticated' );
```

**Policy 3: Allow Authenticated Delete**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'products' AND auth.role() = 'authenticated' );
```

Or use the Supabase UI:
1. Click **"New Policy"**
2. Select **"For full customization"**
3. Policy name: `Public read access`
4. Allowed operation: `SELECT`
5. Target roles: `public`
6. USING expression: `bucket_id = 'products'`
7. Click **"Review"** → **"Save policy"**

Repeat for INSERT and DELETE with `authenticated` role.

### Step 5: Test the Setup

1. Run your app: `npm run dev`
2. Log in as admin
3. Go to Product Management
4. Try uploading a product image
5. ✅ Image should upload to Supabase Storage
6. ✅ Public URL should be saved to Firestore
7. ✅ Image should display in the UI

## 🔄 How It Works

### Image Upload Flow

1. **Admin uploads image** → `ProductForm.tsx`
2. **Calls** → `uploadProductImage(file)` from `useProducts.ts`
3. **Uploads to** → Supabase Storage `products` bucket
4. **Returns** → Public URL (e.g., `https://xxxxx.supabase.co/storage/v1/object/public/products/...`)
5. **Saves URL to** → Firestore `products` collection (`image_url` field)
6. **User sees** → Image displayed using the Supabase public URL

### What's Stored Where

- **Firebase Auth**: User authentication
- **Firebase Firestore**: Product metadata (title, price, stock, etc.) + image URL
- **Supabase Storage**: Actual image files

### Real-Time Updates

- Product data changes → Firestore real-time listeners update UI
- Image URLs are stored in Firestore → No additional Supabase queries needed
- Images load directly from Supabase CDN using public URLs

## 📝 Functions Available

### `uploadProductImage(file: File): Promise<string>`
Uploads an image to Supabase Storage and returns the public URL.

**Usage:**
```typescript
import { uploadProductImage } from '@/lib/supabaseClient';

const publicUrl = await uploadProductImage(imageFile);
// Returns: https://xxxxx.supabase.co/storage/v1/object/public/products/...
```

### `deleteProductImage(imageUrl: string): Promise<void>`
Deletes an image from Supabase Storage.

**Usage:**
```typescript
import { deleteProductImage } from '@/lib/supabaseClient';

await deleteProductImage(oldImageUrl);
```

## 🔐 Security

- **Public read access**: Anyone can view product images (required for e-commerce)
- **Authenticated upload**: Only logged-in users can upload (Firebase Auth token required)
- **Admin-only in app**: `useProducts.ts` checks `isAdmin` before allowing uploads
- **Firestore rules**: Protect product metadata updates to admin-only

## ✅ Checklist

- [ ] Get Supabase credentials
- [ ] Update `src/lib/supabaseClient.ts` with credentials
- [ ] Create `products` bucket in Supabase Storage
- [ ] Set bucket to Public
- [ ] Add storage policies (read, insert, delete)
- [ ] Test image upload in admin panel
- [ ] Verify image displays in user portal

## 🆘 Troubleshooting

### "Failed to upload image"
- Check Supabase credentials are correct
- Verify `products` bucket exists
- Check bucket is set to Public

### "Access denied" or 403 error
- Add storage policies for authenticated users
- Make sure you're logged in as admin

### Image doesn't display
- Check the URL in Firestore is correct
- Verify bucket is Public
- Check browser console for CORS errors

### CORS errors
- Supabase Storage has CORS enabled by default
- If issues persist, check Supabase Dashboard → Storage → Configuration

## 📚 Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [CDN & Performance](https://supabase.com/docs/guides/storage/cdn)
