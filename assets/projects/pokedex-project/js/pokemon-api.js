/**
 * Pokemon API service
 * Handles all interactions with the PokeAPI
 */

class PokemonAPI {
  static BASE_URL = 'https://pokeapi.co/api/v2';
  static pokemonListCache = null;

  /**
   * Fetch Pokemon list for autocomplete
   * @param {number} limit - Number of Pokemon to fetch (default: 1000)
   * @returns {Promise<Array>} Array of Pokemon names
   */
  static async getPokemonList(limit = 1000) {
    if (this.pokemonListCache) {
      return this.pokemonListCache;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/pokemon?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.pokemonListCache = data.results.map(pokemon => pokemon.name);
      
      return this.pokemonListCache;
    } catch (error) {
      console.error('Failed to fetch Pokemon list:', error);
      throw new Error('Failed to load Pokemon list');
    }
  }

  /**
   * Fetch detailed Pokemon data
   * @param {string|number} pokemonName - Pokemon name or ID
   * @returns {Promise<Object>} Pokemon data object
   */
  static async getPokemon(pokemonName) {
    if (!pokemonName) {
      throw new Error('Pokemon name or ID is required');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/pokemon/${pokemonName.toString().toLowerCase()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pokémon not found in the wild!');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatPokemonData(data);
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }

  /**
   * Fetch Pokemon species data (for additional info like descriptions)
   * @param {string|number} pokemonId - Pokemon ID
   * @returns {Promise<Object>} Species data object
   */
  static async getPokemonSpecies(pokemonId) {
    try {
      const response = await fetch(`${this.BASE_URL}/pokemon-species/${pokemonId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Pokemon species:', error);
      return null;
    }
  }

  /**
   * Format raw Pokemon data for consistent use
   * @param {Object} rawData - Raw Pokemon data from API
   * @returns {Object} Formatted Pokemon data
   */
  static formatPokemonData(rawData) {
    return {
      id: rawData.id,
      name: rawData.name,
      height: rawData.height,
      weight: rawData.weight,
      types: rawData.types || [],
      abilities: rawData.abilities || [],
      stats: rawData.stats || [],
      sprites: rawData.sprites || {},
      baseExperience: rawData.base_experience,
      // Add computed properties
      primaryType: rawData.types?.[0]?.type?.name || 'unknown',
      mainAbility: rawData.abilities?.[0]?.ability?.name || 'unknown'
    };
  }

  /**
   * Get random Pokemon ID
   * @param {number} maxId - Maximum Pokemon ID (default: 1010)
   * @returns {number} Random Pokemon ID
   */
  static getRandomPokemonId(maxId = 1010) {
    return Math.floor(Math.random() * maxId) + 1;
  }

  /**
   * Search Pokemon by partial name match
   * @param {string} query - Search query
   * @param {number} limit - Maximum results to return
   * @returns {Promise<Array>} Array of matching Pokemon names
   */
  static async searchPokemon(query, limit = 10) {
    const pokemonList = await this.getPokemonList();
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return [];
    }

    return pokemonList
      .filter(name => name.includes(normalizedQuery))
      .slice(0, limit);
  }

  /**
   * Get Pokemon type color for UI styling
   * @param {string} type - Pokemon type name
   * @returns {string} CSS color value
   */
  static getTypeColor(type) {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };

    return typeColors[type?.toLowerCase()] || '#68A090';
  }

  /**
   * Check if Pokemon name/ID is valid format
   * @param {string} input - Input to validate
   * @returns {boolean} Whether input is valid
   */
  static isValidPokemonInput(input) {
    if (!input || typeof input !== 'string') {
      return false;
    }

    const trimmed = input.trim();
    
    // Check if it's a number (ID)
    if (/^\d+$/.test(trimmed)) {
      const id = parseInt(trimmed);
      return id > 0 && id <= 1010; // Current max Pokemon ID
    }

    // Check if it's a valid name format
    return /^[a-zA-Z0-9\-\.♀♂\s]+$/.test(trimmed) && trimmed.length <= 50;
  }

  /**
   * Clear cached data (useful for testing or memory management)
   */
  static clearCache() {
    this.pokemonListCache = null;
  }
}

// Export for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PokemonAPI;
}