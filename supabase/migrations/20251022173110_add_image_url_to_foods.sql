-- Migration: Add image_url column to foods table
-- Purpose: Store URLs to dog food package images
-- Affected: foods table

-- Add image_url column to foods table
ALTER TABLE public.foods 
ADD COLUMN IF NOT EXISTS image_url text;

-- Add comment explaining the column
COMMENT ON COLUMN public.foods.image_url IS 'URL to the food package image (can be relative path like /images/foods/food.jpg or full URL)';

-- Optional: Add example data (uncomment if you want to test)
-- UPDATE foods SET image_url = '/images/foods/placeholder.jpg' WHERE image_url IS NULL;


