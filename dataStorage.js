const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=500&offset=0";

async function fetchPokemonList() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
  }
}

async function fetchPokemonDetails(pokemonUrl) {
  try {
    const response = await fetch(pokemonUrl);
    const pokemonDetails = await response.json();
    return pokemonDetails;
  } catch (error) {
    console.error(`Error fetching ${pokemonUrl}:`, error);
    return null;
  }
}

async function fetch500Pokemons() {
  try {
    const pokemonList = await fetchPokemonList();
    allPokemon = await Promise.all(
      pokemonList.map(async (pokemon) => {
        return await fetchPokemonDetails(pokemon.url);
      })
    );
  } catch (error) {
    console.error("Error fetching all Pokemon:", error);
  }
}



