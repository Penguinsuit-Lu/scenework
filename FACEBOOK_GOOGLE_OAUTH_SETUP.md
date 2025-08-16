# Facebook & Google OAuth Setup for SceneWork

## Prerequisites

1. **Facebook App** (Required for Facebook OAuth)
2. **Google Cloud Project** (Required for Google OAuth)
3. **Supabase Project** with Auth enabled

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add "Facebook Login" product
4. Configure OAuth Redirect URIs:
   - Add: `https://your-project.supabase.co/auth/v1/callback`
   - Add: `http://localhost:3000/auth/callback` (for development)

## Step 2: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Step 3: Get App Credentials

### Facebook:
- **Facebook App ID**
- **Facebook App Secret**

### Google:
- **Google Client ID**
- **Google Client Secret**

## Step 4: Configure Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Facebook** provider:
   - Enter Facebook App ID and Secret
4. Enable **Google** provider:
   - Enter Google Client ID and Secret
5. Save both configurations

## Step 5: Test the Integration

1. Start your development server
2. Go to `/auth/sign-in`
3. Click "Continue with Facebook" or "Continue with Google"
4. Complete OAuth authorization
5. Check that user data is imported

## What Gets Imported Automatically

### Facebook:
- **Profile Picture**: From Facebook avatar
- **Full Name**: Facebook display name
- **Email**: Facebook email (if provided)
- **Username**: Generated from email or Facebook ID

### Google:
- **Profile Picture**: From Google avatar
- **Full Name**: Google display name
- **Email**: Google email
- **Username**: Generated from email

## Troubleshooting

### Common Issues:

1. **"Provider not enabled"**: Make sure Facebook/Google are enabled in Supabase Auth providers
2. **"Invalid redirect URI"**: Check that your redirect URIs match exactly in app settings
3. **"App not verified"**: Facebook/Google apps may need verification for production use

### OAuth Best Practices:

- **Development**: Use localhost redirects for testing
- **Production**: Use your production domain for redirects
- **Security**: Keep app secrets secure and never expose them in client code

## Environment Variables

Add these to your `.env.local` (if needed for additional API calls):

```bash
# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Security Notes

- OAuth tokens are short-lived
- User data is only accessible during the OAuth flow
- No ongoing access to Facebook/Google accounts
- Users can revoke access anytime from their account settings
