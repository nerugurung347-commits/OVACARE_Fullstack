-- =============================================
-- OVACARE DATABASE SETUP
-- =============================================
-- This script creates tables, enables RLS,
-- creates policies, and sets up auth triggers
-- for the Ovacare application.
-- =============================================

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    age TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cycle data table
CREATE TABLE IF NOT EXISTS public.cycle_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    last_period_date TEXT,
    cycle_length TEXT,
    current_phase TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Preferences table
CREATE TABLE IF NOT EXISTS public.preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    cuisine TEXT,
    health_goal TEXT,
    movement_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. RLS POLICIES - PROFILES
-- =============================================

-- Users can SELECT their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can INSERT their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 4. RLS POLICIES - CYCLE_DATA
-- =============================================

-- Users can SELECT their own cycle data
DROP POLICY IF EXISTS "Users can view own cycle data" ON public.cycle_data;
CREATE POLICY "Users can view own cycle data"
    ON public.cycle_data
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can INSERT their own cycle data
DROP POLICY IF EXISTS "Users can insert own cycle data" ON public.cycle_data;
CREATE POLICY "Users can insert own cycle data"
    ON public.cycle_data
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE their own cycle data
DROP POLICY IF EXISTS "Users can update own cycle data" ON public.cycle_data;
CREATE POLICY "Users can update own cycle data"
    ON public.cycle_data
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 5. RLS POLICIES - PREFERENCES
-- =============================================

-- Users can SELECT their own preferences
DROP POLICY IF EXISTS "Users can view own preferences" ON public.preferences;
CREATE POLICY "Users can view own preferences"
    ON public.preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can INSERT their own preferences
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.preferences;
CREATE POLICY "Users can insert own preferences"
    ON public.preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE their own preferences
DROP POLICY IF EXISTS "Users can update own preferences" ON public.preferences;
CREATE POLICY "Users can update own preferences"
    ON public.preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 6. TRIGGER - AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

-- Function that creates a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();