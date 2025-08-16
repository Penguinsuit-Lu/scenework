-- Simple Database Fix for SceneWork
-- Run this in your Supabase SQL editor

-- 1. First, let's check what tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Create profiles table if it doesn't exist
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

-- 3. Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create basic RLS policies for profiles
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- 6. Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 7. Create basic RLS policies for posts
DROP POLICY IF EXISTS "Users can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;

CREATE POLICY "Users can view all posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 8. Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

GRANT ALL ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;

-- 9. Create indexes
CREATE INDEX IF NOT EXISTS profiles_handle_idx ON public.profiles(handle);
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);

-- 10. Create function to automatically create profiles for new users
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

-- 11. Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Success message
SELECT 'Simple database fix completed! Basic tables and policies created.' as status;
