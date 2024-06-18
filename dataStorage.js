const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=500&offset=0";

async function fetch500Pokemons() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const pokemonData = await fetch(pokemon.url);
        const pokemonDetails = await pokemonData.json();
        return pokemonDetails;
      })
    );
  } catch (error) {
    console.error("Error fetching all Pokemon:", error);
  }
}

