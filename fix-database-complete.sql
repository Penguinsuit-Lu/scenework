-- Complete Database Fix for SceneWork
-- Run this in your Supabase SQL editor

-- 1. Fix the handle column constraint issue
-- First, let's check if the handle column exists and has proper constraints
DO $$ 
BEGIN
    -- Add handle column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'handle') THEN
        ALTER TABLE public.profiles ADD COLUMN handle TEXT;
    END IF;
    
    -- Make handle NOT NULL if it isn't already
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'handle' 
               AND is_nullable = 'YES') THEN
        ALTER TABLE public.profiles ALTER COLUMN handle SET NOT NULL;
    END IF;
    
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint 
                   WHERE conname = 'profiles_handle_key') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_handle_key UNIQUE (handle);
    END IF;
END $$;

-- 2. Add missing columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS top_films JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- 3. Fix the availability column type issue
-- Drop and recreate the availability column to fix the "malformed range literal" error
ALTER TABLE public.profiles DROP COLUMN IF EXISTS availability;
ALTER TABLE public.profiles ADD COLUMN availability TEXT DEFAULT 'Available';

-- 4. Ensure all required columns exist with proper types
ALTER TABLE public.profiles 
ALTER COLUMN full_name SET DATA TYPE TEXT,
ALTER COLUMN role SET DATA TYPE TEXT,
ALTER COLUMN location SET DATA TYPE TEXT,
ALTER COLUMN bio SET DATA TYPE TEXT,
ALTER COLUMN skills SET DATA TYPE TEXT[],
ALTER COLUMN resume_url SET DATA TYPE TEXT,
ALTER COLUMN portfolio SET DATA TYPE JSONB DEFAULT '[]'::jsonb;

-- 5. Enable RLS and set up policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create policies
CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- 6. Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- 7. Create follows table if it doesn't exist
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

-- 8. Create posts table for user posts functionality
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

-- 9. Create the follow count update function
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment following count for follower
        UPDATE public.profiles 
        SET following_count = following_count + 1 
        WHERE id = NEW.follower_id;
        
        -- Increment followers count for following
        UPDATE public.profiles 
        SET followers_count = followers_count + 1 
        WHERE id = NEW.following_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement following count for follower
        UPDATE public.profiles 
        SET following_count = following_count - 1 
        WHERE id = OLD.follower_id;
        
        -- Decrement followers count for following
        UPDATE public.profiles 
        SET followers_count = followers_count - 1 
        WHERE id = OLD.following_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 10. Create the trigger
DROP TRIGGER IF EXISTS trigger_update_follow_counts ON public.follows;
CREATE TRIGGER trigger_update_follow_counts
    AFTER INSERT OR DELETE ON public.follows
    FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- 11. Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 12. Show any existing data
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as total_follows FROM public.follows;
