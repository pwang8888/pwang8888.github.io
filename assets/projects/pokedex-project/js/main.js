/**
 * Main application controller
 * Handles UI interactions and app initialization
 */

class PokedexApp {
  constructor() {
    this.currentPokemon = null;
    this.init();
  }

  async init() {
    try {
      // Initialize autocomplete
      await AutocompleteManager.init();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Load default Pokemon (Pikachu)
      await this.loadPokemon('pikachu');
      
      console.log('Pokédex app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pokédex app:', error);
      this.showError('Failed to initialize the application');
    }
  }

  setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const randomBtn = document.getElementById('randomBtn');
    const pokemonNameInput = document.getElementById('pokemonName');
    const popularPokemon = document.querySelectorAll('.popular-pokemon');

    // Search button
    searchBtn.addEventListener('click', () => this.handleSearch());

    // Random button
    randomBtn.addEventListener('click', () => this.handleRandomPokemon());

    // Enter key in search input
    pokemonNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        AutocompleteManager.hideSuggestions();
        this.handleSearch();
      }
    });

    // Popular Pokemon buttons
    popularPokemon.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pokemonName = e.target.getAttribute('data-pokemon');
        this.selectPokemon(pokemonName);
      });
    });
  }

  selectPokemon(pokemonName) {
    const input = document.getElementById('pokemonName');
    input.value = pokemonName;
    this.loadPokemon(pokemonName);
  }

  async handleSearch() {
    const input = document.getElementById('pokemonName');
    const pokemonName = input.value.trim().toLowerCase();
    
    if (!pokemonName) {
      this.showWelcome('🔍 Please enter a Pokémon name to search');
      return;
    }

    await this.loadPokemon(pokemonName);
  }

  async handleRandomPokemon() {
    const input = document.getElementById('pokemonName');
    const randomId = Math.floor(Math.random() * 1010) + 1;
    
    input.value = '';
    await this.loadPokemon(randomId.toString());
  }

  async loadPokemon(pokemonName) {
    try {
      this.showLoading(pokemonName);
      
      const pokemonData = await PokemonAPI.getPokemon(pokemonName);
      this.displayPokemon(pokemonData);
      this.currentPokemon = pokemonData;
      
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      this.showError(error.message || 'Pokémon not found in the wild!');
    }
  }

  showLoading(pokemonName) {
    const infoBox = document.getElementById('pokemonInfo');
    const displayName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    
    infoBox.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <div>⚡ Catching ${displayName}...</div>
      </div>
    `;
  }

  showError(message) {
    const infoBox = document.getElementById('pokemonInfo');
    
    infoBox.innerHTML = `
      <div class="error">
        <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
        <div style="font-size: 20px; font-weight: 700;">${message}</div>
        <div style="margin-top: 10px; font-size: 14px; opacity: 0.8;">Try the popular Pokémon or check your spelling! 🎯</div>
      </div>
    `;
  }

  showWelcome(message) {
    const infoBox = document.getElementById('pokemonInfo');
    
    infoBox.innerHTML = `
      <div class="welcome">
        ${message}
      </div>
    `;
  }

  displayPokemon(data) {
    const infoBox = document.getElementById('pokemonInfo');
    
    const types = data.types
      .map(type => `<span class="type type-${type.type.name}">${type.type.name}</span>`)
      .join('');

    const imageUrl = data.sprites?.other?.['official-artwork']?.front_default || 
                     data.sprites?.front_default || 
                     '';

    infoBox.innerHTML = `
      <div class="pokemon-name">${data.name}</div>
      
      <div class="pokemon-image-container">
        <div class="pokemon-image">
          ${imageUrl ? `<img src="${imageUrl}" alt="${data.name}" onerror="this.style.display='none'" />` : ''}
        </div>
      </div>
      
      <div class="types">${types}</div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">🆔 Pokédex No.</div>
          <div class="info-value">#${String(data.id).padStart(3, '0')}</div>
        </div>
        <div class="info-item">
          <div class="info-label">📏 Height</div>
          <div class="info-value">${(data.height / 10).toFixed(1)} m</div>
        </div>
        <div class="info-item">
          <div class="info-label">⚖️ Weight</div>
          <div class="info-value">${(data.weight / 10).toFixed(1)} kg</div>
        </div>
        <div class="info-item">
          <div class="info-label">✨ Main Ability</div>
          <div class="info-value">${data.abilities?.[0]?.ability?.name?.replace('-', ' ') || 'Unknown'}</div>
        </div>
      </div>
    `;
  }

  // Utility method to get current Pokemon data
  getCurrentPokemon() {
    return this.currentPokemon;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pokedexApp = new PokedexApp();
});