-- Fix ID column to be auto-incrementing
-- Run this SQL in your Supabase SQL editor

-- First, let's check the current structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'FarmLogging' AND column_name = 'id';

-- Option 1: Add a sequence and set it as default for the id column
-- Create a sequence for the id column
CREATE SEQUENCE IF NOT EXISTS public."FarmLogging_id_seq" 
    AS bigint 
    START WITH 1 
    INCREMENT BY 1 
    NO MINVALUE 
    NO MAXVALUE 
    CACHE 1;

-- Set the sequence as the default value for the id column
ALTER TABLE public."FarmLogging" 
    ALTER COLUMN id SET DEFAULT nextval('public."FarmLogging_id_seq"'::regclass);

-- Set the sequence to be owned by the id column
ALTER SEQUENCE public."FarmLogging_id_seq" 
    OWNED BY public."FarmLogging".id;

-- Option 2: If the above doesn't work, try this alternative approach
-- Drop the existing id column and recreate it with proper auto-increment
-- WARNING: This will delete all existing data in the table!

-- Uncomment the following lines ONLY if you want to recreate the table:
-- ALTER TABLE public."FarmLogging" DROP COLUMN id;
-- ALTER TABLE public."FarmLogging" ADD COLUMN id BIGSERIAL PRIMARY KEY;

-- Option 3: If you want to keep existing data, update the sequence to start from the highest existing id
-- First, find the highest existing id
-- SELECT COALESCE(MAX(id), 0) + 1 FROM public."FarmLogging";

-- Then set the sequence to start from that value (replace X with the actual value)
-- SELECT setval('public."FarmLogging_id_seq"', X, false);


