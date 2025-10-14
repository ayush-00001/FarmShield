-- Farm Records Table Schema for Supabase
-- This matches your existing FarmLogging table schema

-- Your existing table structure:
CREATE TABLE IF NOT EXISTS public."FarmLogging" (
  "Animal_Type" text NOT NULL DEFAULT 'Pig'::text,
  "Quantity" numeric NULL DEFAULT '0'::numeric,
  "Fodder" double precision NULL DEFAULT '0'::double precision,
  "Deaths" numeric NULL DEFAULT '0'::numeric,
  "Symptoms" text NULL,
  "Vaccinations" text NULL,
  "Date" date NULL,
  id bigint NOT NULL,
  CONSTRAINT "FarmLogging_pkey" PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farmlogging_date ON public."FarmLogging"("Date");
CREATE INDEX IF NOT EXISTS idx_farmlogging_animal_type ON public."FarmLogging"("Animal_Type");

-- Enable Row Level Security (RLS) - Optional
-- ALTER TABLE public."FarmLogging" ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for development/testing)
-- You can modify this policy based on your authentication requirements
-- CREATE POLICY "Allow all operations" ON public."FarmLogging"
--   FOR ALL USING (true);

-- For production, you might want to use:
-- CREATE POLICY "Allow all operations for authenticated users" ON public."FarmLogging"
--   FOR ALL USING (auth.role() = 'authenticated');
