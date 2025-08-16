-- Fix Profile Issues for SceneWork
-- Run this in your Supabase SQL editor

-- 1. Ensure profiles table exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT 'Your Name',
    handle TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Creative Professional',
    bio TEXT DEFAULT 'Tell us about yourself and your work.',
    location TEXT DEFAULT 'Location not set',
    skills TEXT[] DEFAULT '{}',
    top_films JSONB DEFAULT '[]',
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    ratings_count INTEGER DEFAULT 0,
    profile_picture_url TEXT,
    theme JSONB DEFAULT '{}',
    availability TEXT DEFAULT 'Available',
    resume_url TEXT,
    portfolio JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop and recreate RLS policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- 4. Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_handle_idx ON public.profiles(handle);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles(location);

-- 6. Fix messages table foreign key issue
-- Drop the problematic foreign key constraint
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;

-- Recreate the foreign key constraints properly
ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7. Create a function to automatically create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, handle, role, bio, location)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Your Name'),
    COALESCE(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8)),
    'Creative Professional',
    'Tell us about yourself and your work.',
    'Location not set'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Success message
SELECT 'Profile issues fixed! Database is ready.' as status;
