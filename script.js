let offset = 0;
let limit = 20;
let currentPokemonId;
let maxPokemonId = 500;


function getTypeClass(types) {
  if (types.includes("water")) return "water";
  if (types.includes("fire")) return "fire";
  if (types.includes("electric")) return "electric";
  if (types.includes("ground")) return "ground";
  if (types.includes("rock")) return "rock";
  if (types.includes("grass")) return "grass";
  if (types.includes("flying")) return "flying";
  if (types.includes("fairy")) return "fairy";
  if (types.includes("normal")) return "normal";
  if (types.includes("fighting")) return "fighting";
  if (types.includes("psychic")) return "psychic";
  return "default";
}

function getStatClass(stat) {
  if (stat.includes("hp")) return "hp";
  if (stat.includes("attack")) return "attack";
  if (stat.includes("defense")) return "defense";
  if (stat.includes("special-attack")) return "specialAttack";
  if (stat.includes("special-defense")) return "specialDefense";
  if (stat.includes("speed")) return "speed";
}

function getStatClassBar(stat) {
  if (stat.includes("hp")) return "hpBar";
  if (stat.includes("attack")) return "attackBar";
  if (stat.includes("defense")) return "defenseBar";
  if (stat.includes("special-attack")) return "specialAttackBar";
  if (stat.includes("special-defense")) return "specialDefenseBar";
  if (stat.includes("speed")) return "speedBar";
}

function formatWeight(num) {
  let numStr = num.toString();
  let length = numStr.length;

  if (length === 2) {
      return numStr[0] + "," + numStr[1];
  } else if (length === 3) {
      return numStr.slice(0, 2) + "," + numStr.slice(2);
  } else if (length >= 4) {
      return numStr.slice(0, 3) + "," + numStr.slice(3);
  } else {
      return numStr;
  }
}

function formatHeight(num) {
  let numStr = num.toString();
  let length = numStr.length;

  if (length === 1) {
      return "0" + "," + numStr[0];
  } else if (length === 2) {
      return numStr.slice(0, 1) + "," + numStr.slice(1);
  } else {
      return numStr;
  }
}

function displayInfoDiv() {
  let movesDiv = document.getElementById('movesDiv');
  let infoDiv = document.getElementById('infoDiv');
  let statsDiv = document.getElementById('statsDiv');
  movesDiv.style.display = 'none';
  infoDiv.style.display = 'block';
  statsDiv.style.display = 'none';
}

function displayMovesDiv() {
  let movesDiv = document.getElementById('movesDiv');
  let infoDiv = document.getElementById('infoDiv');
  let statsDiv = document.getElementById('statsDiv');
  movesDiv.style.display = 'flex';
  infoDiv.style.display = 'none';
  statsDiv.style.display = 'none';
}

function displayStatsDiv() {
  let movesDiv = document.getElementById('movesDiv');
  let infoDiv = document.getElementById('infoDiv');
  let statsDiv = document.getElementById('statsDiv');
  movesDiv.style.display = 'none';
  infoDiv.style.display = 'none';
  statsDiv.style.display = 'flex';
}

function prevCard() {
  if (currentPokemonId) {
    let prevId = currentPokemonId.id === 1 ? maxPokemonId : currentPokemonId.id - 1;
    showPokemonCardFullscreen(prevId);
  }
}

function nextCard() {
  if (currentPokemonId) {
    let nextId = currentPokemonId.id === maxPokemonId ? 1 : currentPokemonId.id + 1;
    showPokemonCardFullscreen(nextId);
  }
}

function renderPokemon(pokeData) {
  let pokedex = document.getElementById("pokedex");
  let typeClasses = pokeData.types.map((typeInfo) => typeInfo.type.name);
  let typeClass = getTypeClass(typeClasses);

  let pokeInnerHTML = generatePokemonCardHTML(pokeData, typeClass);
  pokedex.innerHTML += pokeInnerHTML;
}

async function renderSearchedPokemon(pokeData) {
  let foundPokemon = document.getElementById("foundPokemon");
  let typeClasses = pokeData.types.map((typeInfo) => typeInfo.type.name);
  let typeClass = getTypeClass(typeClasses);

  let pokeInnerHTML = generatePokemonCardHTML(pokeData, typeClass);
  foundPokemon.innerHTML += pokeInnerHTML;
}

async function getSearchInputAndPokemon() {
  let searchInput = document.getElementById("searchPokemon").value.toLowerCase();
  let allPokemon = await fetch500Pokemons();
  return { searchInput, allPokemon };
}

function filterPokemonBySearch(allPokemon, searchInput) {
  return allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().startsWith(searchInput)
  );
}

function handleEmptySearch(foundPokemon, pokedexDiv, loadMorePokemon) {
  foundPokemon.style.display = "none";
  pokedexDiv.style.display = "flex";
  loadMorePokemon.style.visibility = 'visible';
}

function handleNoResults(foundPokemon, pokedexDiv, loadMorePokemon) {
  foundPokemon.innerHTML = "<p>No Pokemon found.</p>";
  pokedexDiv.style.display = "none";
  loadMorePokemon.style.visibility = 'hidden'
}

async function renderFoundPokemon(filteredPokemon, foundPokemon, pokedexDiv, loadMorePokemon) {
  foundPokemon.innerHTML = "";
  for (let pokemonData of filteredPokemon) {
    let pokeData = await fetchPokemonUrl(pokemonData.url);
    renderSearchedPokemon(pokeData);
    pokedexDiv.style.display = "none";
    foundPokemon.style.display = "flex";
    loadMorePokemon.style.visibility = 'hidden'
  }
}

async function searchPokemon() {
  showLoadingScreen();
  try {
    await handleSearchPokemon();
  } finally {
    hideLoadingScreen();
  }
}

async function handleSearchPokemon() {
  let { searchInput, allPokemon } = await getSearchInputAndPokemon();
  let foundPokemon = document.getElementById("foundPokemon");
  let pokedexContainer = document.getElementById("pokedexContainer");
  let loadMorePokemon = document.getElementById("loadMorePokemon");

  let filteredPokemon = filterPokemonBySearch(allPokemon, searchInput);

  if (searchInput === "") {
    handleEmptySearch(foundPokemon, pokedexContainer, loadMorePokemon);
  } else if (filteredPokemon.length === 0) {
    handleNoResults(foundPokemon, pokedexContainer, loadMorePokemon);
  } else {
    await renderFoundPokemon(filteredPokemon, foundPokemon, pokedexContainer, loadMorePokemon);
  }
}

function showPokemonCardFullscreen(id) {
  let fullscreenBackground = document.getElementById("fullscreenBackground");
  let fullscreenCard = document.getElementById("fullscreenCard");
  fullscreenBackground.style.display = "flex";

  fetchPokemonId(id)
    .then(pokeData => {
      currentPokemonId = pokeData;
      let pokemonHTML = generateFullscreenCardHTML(pokeData);
      fullscreenCard.innerHTML = pokemonHTML;
    })
    .catch(error => {
      console.error("Error fetching Pokemon details:", error);
    });
}

function closeFullscreen() {
  let fullscreenBackground = document.getElementById("fullscreenBackground");
  let fullscreenCard = document.getElementById("fullscreenCard");
  fullscreenBackground.style.display = "none";
  fullscreenCard.innerHTML = "";
  currentPokemonId = null;
}

async function init() {
  showLoadingScreen();
  try {
    await fetchLimitedPokemons(offset, limit);
  } finally {
    hideLoadingScreen();
  }
}

async function loadMorePokemon() {
  offset += limit;
  showLoadingScreen();
  try {
    await fetchLimitedPokemons(offset, limit);
  } finally {
    hideLoadingScreen();
  }
}

let searchInput = document.getElementById("searchPokemon");

searchInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^a-zA-Z]/g, "");
});

document.getElementById("fullscreenBackground").addEventListener("click", (event) => {
  let fullscreenCard = document.getElementById("fullscreenCard");
  if (!fullscreenCard.contains(event.target)) {
    closeFullscreen();
  }
});

function hideLoadingScreen() {
  let loadingScreen = document.getElementById('LoadingScreen');
  loadingScreen.style.display = 'none';
}

function showLoadingScreen() {
  let loadingScreen = document.getElementById('LoadingScreen');
  loadingScreen.style.display = 'block';
}

