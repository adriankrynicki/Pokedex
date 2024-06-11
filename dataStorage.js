const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=500&offset=0";

async function fetch500Pokemons() {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const pokemonData = data.results.map(pokemon => {
        const { name, url } = pokemon;
        return { name, url };
      });
      return pokemonData;
    } catch (error) {
      console.error("Error fetching all Pokemon:", error);
    }
  }
  
  async function fetchPokemonUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  }
  
  async function fetchPokemonId(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pokeData = await response.json();
      return pokeData;
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
    }
  }

async function fetchLimitedPokemons(offset, limit) {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const limitedPokemonData = data.results.slice(offset,offset + limit);

    for (const pokemon of limitedPokemonData) {
      await fetchPokemonDetails(pokemon);
    }
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
  }
}

async function fetchPokemonDetails(pokemon) {
  try {
    const response = await fetch(pokemon.url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pokeData = await response.json();
    await renderPokemon(pokeData);
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
  }
}

