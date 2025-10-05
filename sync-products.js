const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Using Supabase URL:', supabaseUrl);

const products = [
    {
        id: 1,
        name: "Remera Oficial Duki",
        price: 3500,
        artist: "Duki",
        artist_slug: "duki",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Remera oficial de Duki, 100% algodón premium",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco"],
        stock: 50
    },
    {
        id: 2,
        name: "Buzo Trap Duki",
        price: 5500,
        artist: "Duki",
        artist_slug: "duki",
        category: "clothing",
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Buzo con capucha oficial de Duki",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris"],
        stock: 30
    },
    {
        id: 3,
        name: "Gorra Duki",
        price: 2500,
        artist: "Duki",
        artist_slug: "duki",
        category: "accessories",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Gorra oficial con logo de Duki",
        sizes: ["Única"],
        colors: ["Negro", "Blanco"],
        stock: 25
    },
    {
        id: 4,
        name: "Crop Top Emilia",
        price: 2800,
        artist: "Emilia Mernes",
        artist_slug: "emilia-mernes",
        category: "clothing",
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Crop top oficial de Emilia Mernes",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Rosa", "Blanco"],
        stock: 40
    },
    {
        id: 5,
        name: "Tote Bag Emilia",
        price: 1800,
        artist: "Emilia Mernes",
        artist_slug: "emilia-mernes",
        category: "accessories",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Bolsa de tela oficial de Emilia Mernes",
        sizes: ["Única"],
        colors: ["Rosa", "Negro"],
        stock: 35
    },
    {
        id: 6,
        name: "Remera Tour Tini",
        price: 3200,
        artist: "Tini Stoessel",
        artist_slug: "tini-stoessel",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Remera oficial del tour de Tini",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco", "Rosa"],
        stock: 45
    },
    {
        id: 7,
        name: "Vinilo Tini",
        price: 4500,
        artist: "Tini Stoessel",
        artist_slug: "tini-stoessel",
        category: "records",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Vinilo oficial del último álbum de Tini",
        sizes: ["Única"],
        colors: ["Negro"],
        stock: 20
    },
    {
        id: 8,
        name: "Remera Cuarteto Luck Ra",
        price: 3000,
        artist: "Luck Ra",
        artist_slug: "luck-ra",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Remera oficial de Luck Ra con diseño cuarteto",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul"],
        stock: 30
    },
    {
        id: 9,
        name: "Bandana Luck Ra",
        price: 1500,
        artist: "Luck Ra",
        artist_slug: "luck-ra",
        category: "accessories",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Bandana oficial de Luck Ra",
        sizes: ["Única"],
        colors: ["Negro", "Rojo"],
        stock: 40
    }
];

async function syncProducts() {
    console.log('🔄 Starting product sync...');

    const { data: artists, error: artistError } = await supabase
        .from('artists')
        .select('*');

    if (artistError) {
        console.error('❌ Error fetching artists:', artistError);
        return;
    }

    if (!artists || artists.length === 0) {
        console.error('❌ No artists found in database');
        return;
    }

    console.log(`Found ${artists.length} artists`);

    const artistMap = {};
    artists.forEach(artist => {
        artistMap[artist.slug] = artist.id;
    });

    for (const product of products) {
        const artistId = artistMap[product.artist_slug];

        if (!artistId) {
            console.log(`⚠️  Artist not found for ${product.artist_slug}, skipping ${product.name}`);
            continue;
        }

        const dbProduct = {
            name: product.name,
            artist_id: artistId,
            description: product.description,
            price: product.price,
            category: product.category,
            image_url: product.image,
            stock_quantity: product.stock,
            sizes: product.sizes,
            colors: product.colors
        };

        const { error } = await supabase
            .from('products')
            .upsert(dbProduct, {
                onConflict: 'name',
                ignoreDuplicates: false
            });

        if (error) {
            console.error(`❌ Error syncing ${product.name}:`, error.message);
        } else {
            console.log(`✅ Synced: ${product.name} - $${product.price}`);
        }
    }

    console.log('✨ Product sync complete!');
}

syncProducts().catch(console.error);
