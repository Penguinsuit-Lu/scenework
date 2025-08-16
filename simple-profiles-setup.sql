-- Simple Profiles Table Setup for SceneWork
-- Run this in your Supabase SQL editor

-- 1. Create the profiles table (most important table)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    location TEXT,
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

-- 3. Create RLS policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- 4. Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- 5. Create basic indexes
CREATE INDEX IF NOT EXISTS profiles_handle_idx ON public.profiles(handle);

-- Success message
SELECT 'Profiles table created successfully! You can now load your profile.' as status;

