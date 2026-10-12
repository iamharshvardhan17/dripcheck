-- Run this SQL in your Supabase SQL Editor to create the clothes table and storage bucket!

-- 1. Create clothes table
CREATE TABLE IF NOT EXISTS public.clothes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'guest',
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  color TEXT,
  color_name TEXT,
  occasions TEXT[] DEFAULT '{}',
  seasons TEXT[] DEFAULT '{}',
  image_url TEXT,
  favorite BOOLEAN DEFAULT false,
  times_worn INTEGER DEFAULT 0,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.clothes ENABLE ROW LEVEL SECURITY;

-- 3. Allow public access for now (or per-user policy)
CREATE POLICY "Allow public read/write for clothes" 
ON public.clothes 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);
