# Firebase Migration Complete

## 🚀 Quick Start (Do This First!)

1. **Set Development Rules** (Firebase Console → Firestore → Rules):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   Click "Publish" and wait 1-2 minutes.

2. **Enable Email/Password Auth** (Firebase Console → Authentication → Sign-in method):
   - Enable "Email/Password" provider
   - Save

3. **Test Regular User Login**:
   - Run `npm run dev`
   - Go to login page
   - Select "User" (not Admin)
   - Sign up with email/password
   - You should be able to log in!

4. **Create Admin User** (Automatic):
   - Sign up with a new account
   - Select "Admin" login type
   - Enter any security code (e.g., "admin123")
   - The app will automatically create an admin document for you!
   - You're now logged in as admin

---

## What Changed

Successfully migrated from Supabase to Firebase Authentication and Firestore.

## Firebase Configuration

Your Firebase project is configured in `src/lib/firebase.ts` with the following services:
- **Authentication**: User sign-in, sign-up, and session management
- **Firestore**: Database for storing user profiles, products, orders, and transactions
- **Analytics**: Google Analytics integration

## Required Firestore Collections

You'll need to create these collections in your Firebase Console:

### 1. profiles
```
{
  user_id: string,
  full_name: string,
  phone: string,
  address: string,
  pincode: string,
  created_at: string,
  updated_at: string
}
```

### 2. admin_users
```
{
  user_id: string,
  admin_level: 'admin' | 'super_admin',
  permissions: object,
  created_at: string,
  updated_at: string
}
```

### 3. products
```
{
  title: string,
  author: string,
  description: string,
  price: number,
  category: 'books' | 'journals' | 'catalogs',
  stock: number,
  image_url: string,
  is_active: boolean,
  created_at: string,
  updated_at: string
}
```

### 4. orders
```
{
  user_id: string,
  order_number: string,
  status: string,
  total_amount: number,
  shipping_address: object,
  payment_status: string,
  payment_method: string,
  notes: string,
  created_at: string,
  updated_at: string
}
```

### 5. transactions
```
{
  order_id: string,
  user_id: string,
  transaction_id: string,
  amount: number,
  status: 'pending' | 'success' | 'failed' | 'cancelled',
  payment_method: string,
  gateway_response: object,
  created_at: string,
  updated_at: string
}
```

### 6. security_audit_log
```
{
  user_id: string,
  action: string,
  table_name: string,
  record_id: string,
  new_values: object,
  ip_address: string,
  user_agent: string,
  timestamp: timestamp
}
```

## Firestore Security Rules

Add these security rules in Firebase Console (Firestore → Rules):

### Development Rules (Use First for Testing)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEVELOPMENT ONLY - Allow all access for testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production Rules (Use After Testing)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    // Profiles - users can read/write their own, admins can read all
    match /profiles/{userId} {
      allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
    }
    
    // Admin users - users can read their own, admins can read all
    match /admin_users/{userId} {
      allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isAdmin();
      allow delete: if false; // Never allow deletion
    }
    
    // Products - everyone can read, only admins can write
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Order items - linked to orders
    match /order_items/{itemId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Orders - users can read their own, admins can read all
    match /orders/{orderId} {
      allow read: if isSignedIn() && 
                     (resource.data.user_id == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
    }
    
    // Transactions - users can read their own, admins can read all
    match /transactions/{transactionId} {
      allow read: if isSignedIn() && 
                     (resource.data.user_id == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
    }
    
    // Security audit log - allow anyone to create, admins to read
    match /security_audit_log/{logId} {
      allow read: if isAdmin();
      allow create: if true; // Allow anyone to create audit logs (even failed logins)
      allow update, delete: if false;
    }
  }
}
```

## Next Steps

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `legalassociate-8d096`
3. Set up Firestore Database (if not already done)
4. Add the security rules above
5. Create the required collections
6. Enable Email/Password authentication in Authentication settings
7. (Optional) Set up Firebase Storage for product images

## Testing

Run your app:
```bash
npm run dev
```

The authentication should now work with Firebase!

## Notes

- Image upload feature needs Firebase Storage configuration
- Real-time updates are enabled for products and transactions
- All authentication flows have been migrated to Firebase Auth


## Creating Your First Admin User

**Good news!** Admin creation is now automatic. Just:

1. Go to the login page
2. Select "Admin" login type
3. Sign up with email/password
4. Enter any security code (e.g., "admin123")
5. The app automatically creates an admin document for you!

That's it! No manual Firestore setup needed for admin users.

### Manual Creation (Optional)

If you prefer to create admin users manually via Firebase Console:

1. Go to Firebase Console → Firestore Database
2. Create a new document in the `admin_users` collection
3. Set the document ID to match your user's UID
4. Add these fields:
   ```
   user_id: <your-user-uid>
   admin_level: "super_admin"
   permissions: {}
   created_at: <current-timestamp>
   updated_at: <current-timestamp>
   ```

## Troubleshooting

### "Admin access requires invitation" error
**This error should no longer occur!** The app now automatically creates admin documents.

**If you still see this:**
- Make sure you're using the updated code
- Check that Firestore rules allow writing to `admin_users` collection
- Use Development Rules (allow all) for testing

### "Missing or insufficient permissions" error
**Cause:** Firestore security rules are blocking access

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Use the **Development Rules** from above (allows all access)
3. Click "Publish"
4. Wait 1-2 minutes for rules to propagate
5. Try logging in again

### "Failed to log authentication" warning
**Cause:** Security audit log collection doesn't exist or rules block it

**Solution:**
- This is just a warning and won't prevent login
- Use Development Rules to allow all access
- Or manually create `security_audit_log` collection in Firestore

### General Tips
- Start with Development Rules (allow all) for testing
- Once everything works, switch to Production Rules
- Make sure to publish rules after editing
- Wait 1-2 minutes after publishing rules before testing
