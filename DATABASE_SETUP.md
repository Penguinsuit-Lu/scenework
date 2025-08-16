# Database Setup for SceneWork

## Issue
The profiles table is missing the `profile_picture_url` and `top_films` columns, causing the "Could not find column" error.

## Solution
You need to run the SQL commands in your Supabase dashboard to add the missing columns.

## Steps

### 1. Go to Supabase Dashboard
- Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Select your SceneWork project

### 2. Open SQL Editor
- Click on "SQL Editor" in the left sidebar
- Click "New Query"

### 3. Run the Database Update
Copy and paste this SQL code:

```sql
-- Add missing columns to the profiles table
-- Run this in your Supabase SQL editor

-- Add profile_picture_url column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add top_films column (JSONB array)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS top_films JSONB DEFAULT '[]'::jsonb;

-- Update RLS policies if needed
-- Make sure the profiles table has proper RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON public.profiles TO authenticated;

-- Create or update the policy for users to manage their own profiles
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Create or update the policy for public read access
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);
```

### 4. Execute the Query
- Click "Run" to execute the SQL commands
- You should see success messages

### 5. Verify the Changes
- Go to "Table Editor" → "profiles"
- Check that the new columns appear:
  - `profile_picture_url` (TEXT)
  - `top_films` (JSONB)

## After Database Update

Once you've run the SQL commands:

1. **Restart your development server** (`npm run dev`)
2. **The profile picture upload and top films sections will become active**
3. **You can now save profiles with these new fields**

## Current Status

- ✅ **Basic profile fields** (name, handle, role, etc.) - Working
- ⏳ **Profile picture upload** - Temporarily disabled until database update
- ⏳ **Top films section** - Temporarily disabled until database update
- ✅ **Portfolio section** - Working
- ✅ **Skills section** - Working

## Need Help?

If you encounter any issues:
1. Check the Supabase dashboard for error messages
2. Ensure your project has the correct permissions
3. Verify the profiles table exists and has the basic structure
