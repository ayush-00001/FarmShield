-- Fix Row Level Security Policies for FarmLogging table
-- Run these SQL commands in your Supabase SQL editor

-- Option 1: Disable RLS temporarily for development/testing
ALTER TABLE public."FarmLogging" DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, create proper policies:

-- First, re-enable RLS (if you disabled it above)
-- ALTER TABLE public."FarmLogging" ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for all users (for development)
-- CREATE POLICY "Allow all operations for all users" ON public."FarmLogging"
--   FOR ALL USING (true);

-- Or create a policy for authenticated users only (for production)
-- CREATE POLICY "Allow all operations for authenticated users" ON public."FarmLogging"
--   FOR ALL USING (auth.role() = 'authenticated');

-- Or create specific policies for each operation:
-- CREATE POLICY "Allow insert for all users" ON public."FarmLogging"
--   FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Allow select for all users" ON public."FarmLogging"
--   FOR SELECT USING (true);

-- CREATE POLICY "Allow update for all users" ON public."FarmLogging"
--   FOR UPDATE USING (true);

-- CREATE POLICY "Allow delete for all users" ON public."FarmLogging"
--   FOR DELETE USING (true);


