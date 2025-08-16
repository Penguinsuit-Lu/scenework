# 🚀 SceneWork Deployment Guide

## 📋 **Prerequisites**

- ✅ SceneWork code pushed to GitHub
- ✅ Supabase project with OAuth configured
- ✅ Vercel account (free tier available)

## 🗄️ **Step 1: Database Setup**

1. **Go to your Supabase project**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Navigate to SQL Editor**
3. **Copy and paste** the contents of `production-database-setup.sql`
4. **Run the script** - this will create all tables, policies, and triggers
5. **Verify success** - you should see: "Production database setup complete! SceneWork is ready for deployment."

## 🔐 **Step 2: Environment Variables**

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OAuth Redirect URLs (add these to Supabase Auth settings)
# http://localhost:3000/auth/callback
# https://your-vercel-domain.vercel.app/auth/callback
```

## 🌐 **Step 3: Deploy to Vercel**

### **Option A: Vercel Dashboard (Recommended)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**: `Penguinsuit-Lu/scenework`
4. **Configure project**:
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. **Add Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
6. **Click "Deploy"**

### **Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts to configure
```

## ⚙️ **Step 4: Post-Deployment Configuration**

### **Update Supabase OAuth Settings**

1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Add your Vercel domain** to Site URL:
   ```
   https://your-project.vercel.app
   ```
3. **Add redirect URLs**:
   ```
   https://your-project.vercel.app/auth/callback
   ```

### **Update Google OAuth (if using)**

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Navigate to APIs & Services** → Credentials
3. **Edit your OAuth 2.0 Client ID**
4. **Add authorized redirect URIs**:
   ```
   https://your-project.vercel.app/auth/callback
   ```

### **Update Facebook OAuth (if using)**

1. **Go to [Facebook Developers](https://developers.facebook.com)**
2. **Edit your Facebook Login app**
3. **Add Valid OAuth Redirect URIs**:
   ```
   https://your-project.vercel.app/auth/callback
   ```

## 🧪 **Step 5: Testing**

1. **Visit your Vercel domain**
2. **Test sign-up/sign-in**
3. **Test OAuth flows**
4. **Test profile creation**
5. **Test posting and following**

## 🚨 **Troubleshooting**

### **Common Issues**

- **"Invalid redirect URI"**: Check OAuth settings in Supabase and providers
- **"Database connection failed"**: Verify environment variables in Vercel
- **"Build failed"**: Check for TypeScript errors locally first

### **Debug Commands**

```bash
# Test locally with production build
npm run build
npm start

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 🎯 **Success Indicators**

✅ **App loads** without errors  
✅ **Sign-up/sign-in** works  
✅ **OAuth flows** complete successfully  
✅ **Profiles** can be created and viewed  
✅ **Posts** can be created and displayed  
✅ **Database** operations work without errors  

## 🔄 **Future Updates**

```bash
# Push changes to GitHub
git add -A
git commit -m "feat: new feature"
git push origin main

# Vercel will automatically redeploy
```

## 📞 **Support**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**🎬 SceneWork is now ready for the world! 🚀**
