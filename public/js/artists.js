import { supabase } from './supabase.js';

async function loadArtists() {
  try {
    const { data: artists, error } = await supabase
      .from('artists')
      .select('*')
      .order('name');

    if (error) throw error;

    const container = document.querySelector('.container');
    container.innerHTML = '';

    artists.forEach(artist => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${artist.image_url}" alt="${artist.name}">
        <div class="content">
          <span>
            <h2>${artist.name}</h2>
            <p>${artist.description}</p>
            <a href="/catalogo-artista?artist=${artist.slug}">
              <button class="btn-catalogo">Ver catálogo</button>
            </a>
          </span>
        </div>
      `;
      container.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading artists:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadArtists);
