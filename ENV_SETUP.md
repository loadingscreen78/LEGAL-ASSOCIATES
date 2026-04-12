# Environment Variables Setup

This project uses environment variables to securely store sensitive configuration data.

## Files Created

1. **`.env`** - Contains actual credentials (DO NOT commit to Git)
2. **`.env.example`** - Template file showing required variables (safe to commit)

## Environment Variables

### Firebase Configuration
Used for authentication, Firestore database, and analytics.

- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Firebase analytics measurement ID

### Supabase Configuration
Used ONLY for product image storage.

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Setup Instructions

### For Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in `.env`

3. Restart your development server:
   ```bash
   npm run dev
   ```

### For New Team Members

1. Request the `.env` file from a team member (via secure channel)
2. Place it in the project root directory
3. Never commit `.env` to Git (it's already in `.gitignore`)

### For Production Deployment

Set environment variables in your hosting platform:

**Vercel/Netlify:**
- Go to Project Settings → Environment Variables
- Add each `VITE_*` variable with its value

**Other Platforms:**
- Follow platform-specific instructions for setting environment variables
- Ensure all `VITE_*` variables are set

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to version control
- Never share credentials in public channels
- Rotate keys if accidentally exposed
- Use different credentials for development and production

## Troubleshooting

### Variables not loading?
1. Ensure variable names start with `VITE_` (required by Vite)
2. Restart dev server after changing `.env`
3. Check for typos in variable names

### Build errors?
1. Verify all required variables are set
2. Check `.env` file is in project root
3. Ensure no trailing spaces in values

## Current Configuration

### Firebase Project
- Project ID: `legalassociate-8d096`
- Used for: Authentication, Firestore Database, Analytics

### Supabase Project
- Project ID: `wvptkawpgmccgsqjkwls`
- Used for: Product image storage only

## Files Updated

The following files now use environment variables:
- `src/lib/firebase.ts` - Firebase configuration
- `src/lib/supabaseClient.ts` - Supabase configuration
