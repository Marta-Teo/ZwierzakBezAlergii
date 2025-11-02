-- Migration: Add trigger to automatically create public.users record on auth.users insert
-- Purpose: Automatically populate public.users table when a new user registers via Supabase Auth
-- Related: auth-spec.md section 3.4
-- Date: 2025-11-02

-- ============================================================================
-- 1. CREATE TRIGGER FUNCTION
-- ============================================================================

-- Function to handle new user registration
-- This function is triggered when a new user is inserted into auth.users
-- It creates a corresponding record in public.users with default 'user' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, created_at, updated_at)
  VALUES (NEW.id, 'user', NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Automatically creates a record in public.users when a new user registers via Supabase Auth';

-- ============================================================================
-- 2. CREATE TRIGGER
-- ============================================================================

-- Trigger to execute handle_new_user() after INSERT on auth.users
-- SECURITY DEFINER ensures the function runs with the privileges of the creator (bypass RLS)
-- Note: This trigger automatically populates public.users table when a new user registers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. NOTES
-- ============================================================================

-- IMPORTANT: This trigger ensures that every user in auth.users has a corresponding
-- record in public.users with a default role of 'user'. This is required for:
-- - RLS policies that check user roles
-- - Future features that store user-specific data (dog profiles, favorites, etc.)
-- 
-- If a user record in auth.users is deleted (CASCADE), the corresponding record 
-- in public.users will also be deleted due to the ON DELETE CASCADE constraint.
--
-- Admin role assignment must be done manually via direct database update or admin panel.

