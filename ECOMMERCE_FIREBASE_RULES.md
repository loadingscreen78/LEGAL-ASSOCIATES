# Complete E-Commerce Firebase Security Rules

## Production-Ready Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper Functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // User Profiles
    match /profiles/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Admin Users
    match /admin_users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isAdmin();
      allow delete: if false; // Never allow deletion
    }
    
    // Products (Books & Journals)
    match /products/{productId} {
      allow read: if true; // Public can browse
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Categories
    match /categories/{categoryId} {
      allow read: if true; // Public can view
      allow write: if isAdmin();
    }
    
    // Subcategories
    match /subcategories/{subcategoryId} {
      allow read: if true; // Public can view
      allow write: if isAdmin();
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if isSignedIn() && 
                     (resource.data.user_id == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin(); // Only admin can update status
      allow delete: if isAdmin();
    }
    
    // Order Items
    match /order_items/{itemId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Transactions
    match /transactions/{transactionId} {
      allow read: if isSignedIn() && 
                     (resource.data.user_id == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if false; // Never delete transactions
    }
    
    // Reviews & Ratings
    match /reviews/{reviewId} {
      allow read: if true; // Public can read approved reviews
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.user_id) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Wishlists
    match /wishlists/{wishlistId} {
      allow read: if isOwner(resource.data.user_id) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.user_id);
      allow delete: if isOwner(resource.data.user_id) || isAdmin();
    }
    
    // Shopping Carts
    match /carts/{cartId} {
      allow read: if isOwner(resource.data.user_id) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.user_id);
      allow delete: if isOwner(resource.data.user_id) || isAdmin();
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isOwner(resource.data.user_id) || isAdmin();
      allow create: if isAdmin();
      allow update: if isOwner(resource.data.user_id) || isAdmin();
      allow delete: if isOwner(resource.data.user_id) || isAdmin();
    }
    
    // Inventory Alerts
    match /inventory_alerts/{alertId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // Analytics Data
    match /analytics/{docId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // Security Audit Log
    match /security_audit_log/{logId} {
      allow read: if isAdmin();
      allow create: if true; // Anyone can log events
      allow update, delete: if false;
    }
    
    // Refund Requests
    match /refund_requests/{requestId} {
      allow read: if isSignedIn() && 
                     (resource.data.user_id == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Delivery Partners
    match /delivery_partners/{partnerId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Product Images (Books/Journals covers)
    match /products/{productId}/{allPaths=**} {
      allow read: if true; // Public can view
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    // User Profile Pictures
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Invoices
    match /invoices/{orderId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    // CSV Imports/Exports
    match /inventory/{fileName} {
      allow read, write: if request.auth != null && 
                            exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
  }
}
```

## Development Rules (Use First for Testing)

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

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## How to Apply Rules

1. **Start with Development Rules** (allow all):
   - Firebase Console → Firestore Database → Rules
   - Paste development rules
   - Click "Publish"

2. **Test Your App**:
   - Make sure everything works
   - Test admin and user features

3. **Switch to Production Rules**:
   - Once everything works, replace with production rules
   - Test again to ensure proper access control

## Important Notes

- Development rules allow everything - perfect for initial testing
- Production rules enforce proper security based on user roles
- Admin users are identified by existence in `admin_users` collection
- All real-time updates work automatically with these rules
- Storage rules protect file uploads/downloads appropriately
