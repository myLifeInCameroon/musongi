-- Add raw_materials column if it doesn't exist
ALTER TABLE public.canvas_data 
ADD COLUMN IF NOT EXISTS raw_materials jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Add region and tax_rate columns for tax calculations
ALTER TABLE public.canvas_data 
ADD COLUMN IF NOT EXISTS region text DEFAULT 'custom',
ADD COLUMN IF NOT EXISTS custom_tax_rate numeric DEFAULT 30;

-- Create index for faster project listing
CREATE INDEX IF NOT EXISTS idx_canvas_data_user_updated 
ON public.canvas_data(user_id, updated_at DESC);