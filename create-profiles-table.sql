-- Create the basic profiles table for SceneWork
-- Run this in your Supabase SQL editor

-- 1. Create the profiles table
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

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_handle_idx ON public.profiles(handle);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles(location);

-- 6. Create the posts table for user posts functionality
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create posts policies
DROP POLICY IF EXISTS "Users can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

CREATE POLICY "Users can view all posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = author_id);

-- Grant permissions on posts table
GRANT ALL ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);

-- 7. Create the follows table for user following functionality
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Enable RLS on follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create follows policies
DROP POLICY IF EXISTS "Users can view their own follows" ON public.follows;
DROP POLICY IF EXISTS "Users can create follows for themselves" ON public.follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.follows;

CREATE POLICY "Users can view their own follows" ON public.follows
    FOR SELECT USING (auth.uid() = follower_id);

CREATE POLICY "Users can create follows for themselves" ON public.follows
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON public.follows
    FOR DELETE USING (auth.uid() = follower_id);

-- Grant permissions on follows table
GRANT ALL ON public.follows TO authenticated;
GRANT SELECT ON public.follows TO anon;

-- 8. Create the projects table for project functionality
CREATE TABLE IF NOT EXISTS public.projects (
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

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create projects policies
DROP POLICY IF EXISTS "Users can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Users can view all projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = created_by);

-- Grant permissions on projects table
GRANT ALL ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS projects_created_by_idx ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS projects_role_needed_idx ON public.projects(role_needed);
CREATE INDEX IF NOT EXISTS projects_location_idx ON public.projects(location);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects(created_at DESC);

-- 9. Create the marketplace_listings table for marketplace functionality
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
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

-- Enable RLS on marketplace_listings table
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Create marketplace_listings policies
DROP POLICY IF EXISTS "Users can view all marketplace listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can create their own marketplace listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can update their own marketplace listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can delete their own marketplace listings" ON public.marketplace_listings;

CREATE POLICY "Users can view all marketplace listings" ON public.marketplace_listings
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own marketplace listings" ON public.marketplace_listings
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own marketplace listings" ON public.marketplace_listings
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own marketplace listings" ON public.marketplace_listings
    FOR DELETE USING (auth.uid() = created_by);

-- Grant permissions on marketplace_listings table
GRANT ALL ON public.marketplace_listings TO authenticated;
GRANT SELECT ON public.marketplace_listings TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS marketplace_listings_created_by_idx ON public.marketplace_listings(created_by);
CREATE INDEX IF NOT EXISTS marketplace_listings_category_idx ON public.marketplace_listings(category);
CREATE INDEX IF NOT EXISTS marketplace_listings_location_idx ON public.marketplace_listings(location);
CREATE INDEX IF NOT EXISTS marketplace_listings_created_at_idx ON public.marketplace_listings(created_at DESC);

-- 10. Create the messages table for messaging functionality
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create messages policies
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Grant permissions on messages table
GRANT ALL ON public.messages TO authenticated;
GRANT SELECT ON public.messages TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);

-- Success message
SELECT 'All tables created successfully! SceneWork database is ready.' as status;
