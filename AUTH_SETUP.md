# Authentication Setup for SceneWork

## Overview
This authentication system uses Supabase for user management with automatic profile creation and onboarding flow.

## Features
- ✅ Email/password authentication
- ✅ Automatic profile creation on signup
- ✅ User onboarding flow
- ✅ Protected routes
- ✅ User menu with avatar
- ✅ Sign out functionality

## Setup Steps

### 1. Supabase Configuration
1. Go to your Supabase project dashboard
2. Navigate to **Settings > API**
3. Copy your Project URL and anon key
4. Create `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 2. Database Setup
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `database-schema.sql`
3. Run the SQL to create the profiles table and policies

### 3. Authentication Settings
1. Go to **Authentication > Settings** in Supabase
2. Enable **Email confirmations** (optional but recommended)
3. Set your site URL to `http://localhost:3000` for development
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/profile/edit`

## Pages Created

### `/auth/sign-in`
- Sign in/up form
- Automatic profile creation
- Redirects to onboarding

### `/auth/callback`
- Handles authentication redirects
- Checks profile completion
- Redirects appropriately

### `/profile/edit`
- User onboarding form
- Required: full_name, handle, role
- Optional: location, bio
- Sign out option

## Components Updated

### Header Component
- Shows sign in button for unauthenticated users
- Shows user avatar menu for authenticated users
- User menu includes: profile info, edit profile, sign out
- Responsive navigation

## Database Schema

### profiles table
- `id` - UUID (references auth.users)
- `email` - User's email address
- `full_name` - User's full name
- `handle` - Unique username/handle
- `role` - User's role in film industry
- `location` - User's location
- `bio` - User biography
- `avatar_url` - Profile picture URL
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

## Security Features
- Row Level Security (RLS) enabled
- Users can only access their own profile data
- Automatic profile creation via database trigger
- Secure authentication flow

## Usage Examples

### Check Authentication Status
```typescript
import { supabase } from '@/lib/supabase'

const { data: { session } } = await supabase.auth.getSession()
if (session?.user) {
  // User is authenticated
}
```

### Get User Profile
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Sign Out
```typescript
await supabase.auth.signOut()
```

## Next Steps
1. Test the authentication flow
2. Customize the onboarding form fields
3. Add profile picture upload functionality
4. Implement additional user roles and permissions
5. Add email verification flow
