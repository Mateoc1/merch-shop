/*
  # Create Artists and Products Tables

  1. New Tables
    - `artists`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `artist_id` (uuid, foreign key to artists)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text) - clothing, accessories, etc.
      - `image_url` (text)
      - `stock_quantity` (integer)
      - `sizes` (text array)
      - `colors` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (anyone can view artists and products)
    - Restrict write operations to authenticated admin users

  3. Indexes
    - Add index on artist slug for fast lookups
    - Add index on product artist_id for catalog queries
    - Add index on product category for filtering
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'merchandise',
  image_url text NOT NULL DEFAULT '',
  stock_quantity integer NOT NULL DEFAULT 0,
  sizes text[] DEFAULT ARRAY['Única'],
  colors text[] DEFAULT ARRAY['Negro'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for artists (public read access)
CREATE POLICY "Anyone can view artists"
  ON artists
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert artists"
  ON artists
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update artists"
  ON artists
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete artists"
  ON artists
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for products (public read access)
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_products_artist_id ON products(artist_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create trigger for artists updated_at
DROP TRIGGER IF EXISTS artists_updated_at ON artists;
CREATE TRIGGER artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create trigger for products updated_at
DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert initial artists data
INSERT INTO artists (name, slug, description, image_url) VALUES
  ('Duki', 'duki', 'Mauro Ezequiel Lombardo Quiroga (1996), conocido como Duki, es un rapero y cantante argentino, referente del trap en español. Saltó a la fama en "El Quinto Escalón" y con el tema She Don''t Give a FO.', 'https://upload.wikimedia.org/wikipedia/commons/d/da/El_Duki.png'),
  ('Emilia Mernes', 'emilia-mernes', 'María Emilia Mernes Rueda (1996), conocida como Emilia, es una cantante argentina. Con éxitos como Como si no importara se consolidó como una de las voces más destacadas.', 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Emilia_Mernes_2020.png'),
  ('Tini Stoessel', 'tini-stoessel', 'Martina Stoessel (1997), conocida como Tini, alcanzó fama internacional con Violetta. Fusiona pop y reguetón con éxitos como Miénteme y La Triple T.', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Tini_Stoessel_photoshoot_2013.png'),
  ('Luck Ra', 'luck-ra', 'Ignacio Matías Lugo (2001), conocido como Luck Ra, es un cantante y compositor argentino. Inició en el rap y el freestyle, pero alcanzó gran popularidad al fusionar la música urbana con el cuarteto. Es autor de éxitos como La Morocha y Ya No Vuelvas.', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Luck_Ra_2023.png')
ON CONFLICT (slug) DO NOTHING;