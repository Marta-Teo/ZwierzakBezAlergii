-- Migration: Add unique constraint to ingredients.name
-- Description: Ensures that ingredient names are unique in the database
-- Date: 2025-11-10

-- Note: This migration is designed to work with seed.sql that uses ON CONFLICT DO NOTHING
-- No need to clean up duplicates - seed.sql handles it

-- Add unique constraint to ingredients.name
-- This will fail if there are existing duplicates, which is intentional
-- The seed.sql file now uses ON CONFLICT (name) DO NOTHING to prevent duplicates
ALTER TABLE public.ingredients 
ADD CONSTRAINT ingredients_name_unique UNIQUE (name);

-- Comment
COMMENT ON CONSTRAINT ingredients_name_unique ON public.ingredients 
IS 'Ensures ingredient names are unique across the database';

