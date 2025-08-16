-- NUCLEAR DATABASE FIX - This will completely reset your database
-- WARNING: This will delete all existing data
-- Run this in your Supabase SQL editor

-- 1. Drop ALL existing tables and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.follows CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.marketplace_listings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create profiles table
CREATE TABLE public.profiles (
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

-- 3. Create posts table
CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create follows table
CREATE TABLE public.follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 5. Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    role_needed TEXT NOT NULL,
    location TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create marketplace_listings table
CREATE TABLE public.marketplace_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Gear', 'Location', 'Service')),
    rate TEXT NOT NULL,
    location TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 9. Create ALL RLS policies
-- Profiles policies
CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Posts policies
CREATE POLICY "Users can view all posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = author_id);

-- Follows policies
CREATE POLICY "Users can view their own follows" ON public.follows
    FOR SELECT USING (auth.uid() = follower_id);

CREATE POLICY "Users can create follows for themselves" ON public.follows
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON public.follows
    FOR DELETE USING (auth.uid() = follower_id);

-- Projects policies
CREATE POLICY "Users can view all projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = created_by);

-- Marketplace policies
CREATE POLICY "Users can view all marketplace listings" ON public.marketplace_listings
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own marketplace listings" ON public.marketplace_listings
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own marketplace listings" ON public.marketplace_listings
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own marketplace listings" ON public.marketplace_listings
    FOR DELETE USING (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 10. Grant ALL permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

GRANT ALL ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;

GRANT ALL ON public.follows TO authenticated;
GRANT SELECT ON public.follows TO anon;

GRANT ALL ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;

GRANT ALL ON public.marketplace_listings TO authenticated;
GRANT SELECT ON public.marketplace_listings TO anon;

GRANT ALL ON public.messages TO authenticated;
GRANT SELECT ON public.messages TO anon;

-- 11. Create ALL indexes
CREATE INDEX profiles_handle_idx ON public.profiles(handle);
CREATE INDEX profiles_role_idx ON public.profiles(role);
CREATE INDEX profiles_location_idx ON public.profiles(location);

CREATE INDEX posts_author_id_idx ON public.posts(author_id);
CREATE INDEX posts_created_at_idx ON public.posts(created_at DESC);

CREATE INDEX follows_follower_id_idx ON public.follows(follower_id);
CREATE INDEX follows_following_id_idx ON public.follows(following_id);

CREATE INDEX projects_created_by_idx ON public.projects(created_by);
CREATE INDEX projects_role_needed_idx ON public.projects(role_needed);
CREATE INDEX projects_location_idx ON public.projects(location);
CREATE INDEX projects_created_at_idx ON public.projects(created_at DESC);

CREATE INDEX marketplace_listings_created_by_idx ON public.marketplace_listings(created_by);
CREATE INDEX marketplace_listings_category_idx ON public.marketplace_listings(category);
CREATE INDEX marketplace_listings_location_idx ON public.marketplace_listings(location);
CREATE INDEX marketplace_listings_created_at_idx ON public.marketplace_listings(created_at DESC);

CREATE INDEX messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX messages_recipient_id_idx ON public.messages(recipient_id);
CREATE INDEX messages_created_at_idx ON public.messages(created_at DESC);

-- 12. Create function to automatically create profiles for new users
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

-- 13. Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 14. Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Success message
SELECT 'NUCLEAR DATABASE FIX COMPLETED! All tables recreated successfully.' as status;
