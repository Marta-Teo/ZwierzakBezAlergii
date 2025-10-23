-- Migration: Add published and excerpt fields to articles table
-- Purpose: Enable article draft/published workflow and improve listing UX
-- Date: 2025-10-23

-- Add excerpt column (short description for article cards)
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS excerpt text;

COMMENT ON COLUMN public.articles.excerpt IS 'Short article description (120-200 chars) displayed in article cards';

-- Add published column (draft vs published state)
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.articles.published IS 'Publication status: true = published (visible), false = draft (hidden)';

-- Create index for filtering by published status (performance optimization)
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);

COMMENT ON INDEX idx_articles_published IS 'Speeds up queries filtering by publication status';

-- Update existing articles to be published (backwards compatibility)
UPDATE public.articles SET published = true WHERE published IS NULL OR published = false;

