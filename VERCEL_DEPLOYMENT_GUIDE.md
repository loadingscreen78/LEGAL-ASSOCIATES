# Vercel Deployment Guide

## Project Overview
This is a **frontend-only** React + Vite application with:
- **Firebase**: Authentication, Firestore Database, Analytics
- **Supabase**: Product image storage only
- **No separate backend server required**

## Environment Variables File
All environment variables are in `.env2` file.

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository: `legal-luminance-design`

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 3. Configure Build Settings

Vercel should auto-detect these settings, but verify:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4. Add Environment Variables

#### Method 1: Via Dashboard (Recommended)
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable from `.env2` file:

**Add these 9 variables:**

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyDcsJM946P4-IR1q6zaZBd2fINxBKhMSuU` | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | `legalassociate-8d096.firebaseapp.com` | Production, Preview, Development |
| `VITE_FIREBASE_PROJECT_ID` | `legalassociate-8d096` | Production, Preview, Development |
| `VITE_FIREBASE_STORAGE_BUCKET` | `legalassociate-8d096.firebasestorage.app` | Production, Preview, Development |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `43613217831` | Production, Preview, Development |
| `VITE_FIREBASE_APP_ID` | `1:43613217831:web:ba1de65bea02fc08d8da02` | Production, Preview, Development |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-SQSE3E8G3C` | Production, Preview, Development |
| `VITE_SUPABASE_URL` | `https://wvptkawpgmccgsqjkwls.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

4. Click **Save** after adding each variable

#### Method 2: Via Vercel CLI
```bash
# Set environment variables via CLI
vercel env add VITE_FIREBASE_API_KEY
# Paste the value when prompted
# Select: Production, Preview, Development

# Repeat for all 9 variables
```

### 5. Deploy

#### First Deployment
```bash
vercel --prod
```

#### Subsequent Deployments
```bash
# Automatic deployment on git push (if connected to Git)
git push origin main

# Or manual deployment
vercel --prod
```

### 6. Configure Firebase for Production

Add your Vercel domain to Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `legalassociate-8d096`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domains:
   - `your-project.vercel.app`
   - `your-custom-domain.com` (if using custom domain)

### 7. Configure Supabase for Production

Add your Vercel domain to Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `wvptkawpgmccgsqjkwls`
3. Go to **Settings** → **API**
4. Under **URL Configuration**, add your Vercel domain to allowed origins

## Vercel Configuration File (Optional)

Create `vercel.json` in project root for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Environment Variables Not Working
- Ensure variable names start with `VITE_`
- Check variables are set for correct environment
- Redeploy after adding variables

### Firebase Authentication Errors
- Verify domain is added to Firebase authorized domains
- Check Firebase API key is correct
- Ensure auth domain matches Firebase config

### Supabase Image Upload Fails
- Verify Supabase URL and key are correct
- Check storage bucket policies
- Ensure domain is allowed in Supabase settings

### 404 Errors on Refresh
- Add rewrite rules in `vercel.json` (see above)
- Ensure SPA routing is configured

## Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Add custom domain to Firebase authorized domains
5. Add custom domain to Supabase allowed origins

## Monitoring & Analytics

### Vercel Analytics
- Automatically enabled for all deployments
- View in Dashboard → Analytics

### Firebase Analytics
- Already configured in the app
- View in Firebase Console → Analytics

## Performance Optimization

### Already Implemented:
- ✅ Vite for fast builds
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Asset optimization

### Recommended:
- Enable Vercel Edge Network
- Configure caching headers
- Use Vercel Image Optimization for static images

## Security Checklist

- ✅ Environment variables not in Git
- ✅ Firebase security rules configured
- ✅ Supabase RLS policies set
- ✅ HTTPS enforced by Vercel
- ⚠️ Review Firebase security rules regularly
- ⚠️ Rotate API keys if exposed

## Deployment Checklist

- [ ] All code committed and pushed to Git
- [ ] Environment variables added to Vercel
- [ ] Firebase authorized domains updated
- [ ] Supabase allowed origins updated
- [ ] Build succeeds locally (`npm run build`)
- [ ] Test deployment on Vercel preview
- [ ] Deploy to production
- [ ] Test all features on production URL
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and alerts

## Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Firebase Support
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

### Supabase Support
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

## Quick Commands Reference

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Pull environment variables
vercel env pull

# Link local project to Vercel
vercel link
```

## Project Structure

```
legal-luminance-design/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Firebase & Supabase config
│   └── contexts/          # React contexts
├── public/                # Static assets
├── dist/                  # Build output (auto-generated)
├── .env                   # Local environment variables
├── .env2                  # Vercel environment variables
├── package.json           # Dependencies
└── vite.config.ts         # Vite configuration
```

## Notes

- This is a **static site** - no server-side rendering
- All API calls go directly to Firebase/Supabase
- No backend server needed
- Vercel handles CDN and edge caching automatically
