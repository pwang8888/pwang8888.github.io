/**
 * Autocomplete functionality for Pokemon search
 * Handles search suggestions and user interactions
 */

class AutocompleteManager {
  static pokemonList = [];
  static isInitialized = false;
  static currentSuggestions = [];

  /**
   * Initialize the autocomplete system
   */
  static async init() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Load Pokemon list
      this.pokemonList = await PokemonAPI.getPokemonList();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log(`Autocomplete initialized with ${this.pokemonList.length} Pokemon`);
    } catch (error) {
      console.error('Failed to initialize autocomplete:', error);
      throw error;
    }
  }

  /**
   * Set up all event listeners for autocomplete functionality
   */
  static setupEventListeners() {
    const input = document.getElementById('pokemonName');
    const suggestions = document.getElementById('suggestions');

    if (!input || !suggestions) {
      console.error('Required DOM elements not found for autocomplete');
      return;
    }

    // Input event for real-time suggestions
    input.addEventListener('input', (e) => {
      this.handleInput(e.target.value);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      this.handleKeyNavigation(e);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.input-container')) {
        this.hideSuggestions();
      }
    });

    // Handle suggestion clicks
    suggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion')) {
        this.selectSuggestion(e.target.textContent);
      }
    });
  }

  /**
   * Handle input changes and show suggestions
   * @param {string} value - Current input value
   */
  static handleInput(value) {
    const query = value.trim().toLowerCase();
    
    if (!query) {
      this.hideSuggestions();
      return;
    }

    if (query.length < 1) {
      this.hideSuggestions();
      return;
    }

    const matches = this.findMatches(query, 8);
    this.showSuggestions(matches);
  }

  /**
   * Find Pokemon matches based on query
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Array} Array of matching Pokemon names
   */
  static findMatches(query, limit = 5) {
    if (!query || !this.pokemonList.length) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    
    // Prioritize exact matches and starts-with matches
    const exactMatches = [];
    const startsWithMatches = [];
    const containsMatches = [];

    for (const pokemon of this.pokemonList) {
      const pokemonLower = pokemon.toLowerCase();
      
      if (pokemonLower === normalizedQuery) {
        exactMatches.push(pokemon);
      } else if (pokemonLower.startsWith(normalizedQuery)) {
        startsWithMatches.push(pokemon);
      } else if (pokemonLower.includes(normalizedQuery)) {
        containsMatches.push(pokemon);
      }

      // Stop if we have enough matches
      if (exactMatches.length + startsWithMatches.length + containsMatches.length >= limit) {
        break;
      }
    }

    // Combine results with priority order
    return [
      ...exactMatches,
      ...startsWithMatches.slice(0, limit - exactMatches.length),
      ...containsMatches.slice(0, limit - exactMatches.length - startsWithMatches.length)
    ].slice(0, limit);
  }

  /**
   * Display suggestions in the dropdown
   * @param {Array} matches - Array of Pokemon names to show
   */
  static showSuggestions(matches) {
    const suggestions = document.getElementById('suggestions');
    
    if (!suggestions) {
      return;
    }

    // Clear previous suggestions
    suggestions.innerHTML = '';
    this.currentSuggestions = matches;

    if (matches.length === 0) {
      this.hideSuggestions();
      return;
    }

    // Create suggestion elements
    matches.forEach((pokemon, index) => {
      const suggestionElement = document.createElement('div');
      suggestionElement.className = 'suggestion';
      suggestionElement.textContent = this.formatPokemonName(pokemon);
      suggestionElement.setAttribute('data-index', index);
      
      // Add hover effects
      suggestionElement.addEventListener('mouseenter', () => {
        this.highlightSuggestion(index);
      });

      suggestions.appendChild(suggestionElement);
    });

    // Show the suggestions dropdown
    suggestions.style.display = 'block';
  }

  /**
   * Hide the suggestions dropdown
   */
  static hideSuggestions() {
    const suggestions = document.getElementById('suggestions');
    if (suggestions) {
      suggestions.style.display = 'none';
      suggestions.innerHTML = '';
    }
    this.currentSuggestions = [];
    this.selectedIndex = -1;
  }

  /**
   * Select a suggestion and update the input
   * @param {string} pokemonName - Selected Pokemon name
   */
  static selectSuggestion(pokemonName) {
    const input = document.getElementById('pokemonName');
    if (input) {
      input.value = pokemonName.toLowerCase();
      this.hideSuggestions();
      
      // Trigger search if app is available
      if (window.pokedexApp) {
        window.pokedexApp.handleSearch();
      }
    }
  }

  /**
   * Handle keyboard navigation in suggestions
   * @param {KeyboardEvent} e - Keyboard event
   */
  static handleKeyNavigation(e) {
    const suggestions = document.querySelectorAll('.suggestion');
    
    if (suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, suggestions.length - 1);
        this.highlightSuggestion(this.selectedIndex);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        if (this.selectedIndex === -1) {
          this.clearHighlight();
        } else {
          this.highlightSuggestion(this.selectedIndex);
        }
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0 && suggestions[this.selectedIndex]) {
          this.selectSuggestion(suggestions[this.selectedIndex].textContent);
        }
        break;
        
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  /**
   * Highlight a suggestion at the given index
   * @param {number} index - Index of suggestion to highlight
   */
  static highlightSuggestion(index) {
    const suggestions = document.querySelectorAll('.suggestion');
    
    // Clear previous highlights
    this.clearHighlight();
    
    // Highlight the selected suggestion
    if (suggestions[index]) {
      suggestions[index].classList.add('highlighted');
      this.selectedIndex = index;
    }
  }

  /**
   * Clear all suggestion highlights
   */
  static clearHighlight() {
    const suggestions = document.querySelectorAll('.suggestion');
    suggestions.forEach(suggestion => {
      suggestion.classList.remove('highlighted');
    });
  }

  /**
   * Format Pokemon name for display (capitalize first letter)
   * @param {string} name - Pokemon name
   * @returns {string} Formatted name
   */
  static formatPokemonName(name) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Get current suggestions
   * @returns {Array} Current suggestion list
   */
  static getCurrentSuggestions() {
    return this.currentSuggestions;
  }

  /**
   * Check if autocomplete is initialized
   * @returns {boolean} Initialization status
   */
  static getInitializationStatus() {
    return this.isInitialized;
  }

  // Track selected suggestion index
  static selectedIndex = -1;
}

// Export for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutocompleteManager;
}