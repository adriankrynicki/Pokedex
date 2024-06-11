let offset = 0;
let limit = 20;
let currentPokemonId;
let maxPokemonId = 500;


const typeClasses = [
  "water", "fire", "electric", "ground", "rock",
  "grass", "flying", "fairy", "normal", "fighting", "psychic"
];

function getTypeClass(types) {
  for (const type of types) {
    const index = typeClasses.indexOf(type);
    if (index !== -1) return typeClasses[index];
  }
  return "default";
}

const statClasses = {
  hp: "hp",
  attack: "attack", 
  defense: "defense",
  "special-attack": "specialAttack",
  "special-defense": "specialDefense",
  speed: "speed"
};

function getStatClass(stat) {
  return statClasses[Object.keys(statClasses).find(key => stat.includes(key))] || "";
}

const statClassBars = {
  hp: "hpBar",
  attack: "attackBar",
  defense: "defenseBar",
  "special-attack": "specialAttackBar", 
  "special-defense": "specialDefenseBar",
  speed: "speedBar"
};

function getStatClassBar(stat) {
  return statClassBars[Object.keys(statClassBars).find(key => stat.includes(key))] || "";
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

async function renderPokemon(pokeData) {
  let pokedex = document.getElementById("pokedex");
  let typeClasses = pokeData.types.map((typeInfo) => typeInfo.type.name);
  let typeClass = getTypeClass(typeClasses);

  let pokeInnerHTML = generatePokemonCardHTML(pokeData, typeClass);
  pokedex.innerHTML += pokeInnerHTML;
  await handleSearchPokemon();
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
    pokemon.name.toLowerCase().includes(searchInput)
  );
}

function handleEmptySearch(foundPokemon, pokedexContainer, loadMorePokemon, notFound) {
  foundPokemon.style.display = "none";
  pokedexContainer.style.display = "flex";
  loadMorePokemon.style.visibility = 'visible';
  notFound.style.display = "none";
}

function handleNoResults(foundPokemon, pokedexContainer, loadMorePokemon, notFound) {
  notFound.style.display = "flex";
  foundPokemon.style.display = "none";
  pokedexContainer.style.display = "none";
  loadMorePokemon.style.visibility = 'hidden'
}

async function renderFoundPokemon(filteredPokemon, foundPokemon, pokedexContainer, loadMorePokemon, notFound) {
  foundPokemon.innerHTML = "";
  for (let pokemonData of filteredPokemon) {
    let pokeData = await fetchPokemonUrl(pokemonData.url);
    renderSearchedPokemon(pokeData);
    notFound.style.display = "none";
    pokedexContainer.style.display = "none";
    foundPokemon.style.display = "flex";
    loadMorePokemon.style.visibility = 'hidden'
  }
}

async function handleSearchPokemon() {
  let { searchInput, allPokemon } = await getSearchInputAndPokemon();
  let foundPokemon = document.getElementById("foundPokemon");
  let pokedexContainer = document.getElementById("pokedexContainer");
  let loadMorePokemon = document.getElementById("loadMorePokemon");
  let notFound = document.getElementById("notFound");

  let filteredPokemon = filterPokemonBySearch(allPokemon, searchInput);

  if (searchInput === "") {
    handleEmptySearch(foundPokemon, pokedexContainer, loadMorePokemon, notFound);
  } else if (filteredPokemon.length === 0) {
    handleNoResults(foundPokemon, pokedexContainer, loadMorePokemon, notFound);
  } else {
    await renderFoundPokemon(filteredPokemon, foundPokemon, pokedexContainer, loadMorePokemon, notFound);
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

function showPokemonCardFullscreen(id) {
  let fullscreenBackground = document.getElementById("fullscreenBackground");
  let fullscreenCard = document.getElementById("fullscreenCard");
  fullscreenBackground.style.display = "flex";
  let searchInput = document.getElementById("searchPokemon");
  searchInput.value = "";

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

async function loadMorePokemons() {
  offset += limit;
  showLoadingScreen();
  try {
    await fetchLimitedPokemons(offset, limit);
  } finally {
    hideLoadingScreen();
  }
}

function reset() {
  showLoadingScreen();
  try {
    window.location.reload();;
  } finally {
    hideLoadingScreen();
  }
}

let searchInput = document.getElementById("searchPokemon");

searchInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^a-zA-Z]/g, "");

  if (this.value === "") {
    handleEmptySearch(foundPokemon, pokedexContainer, loadMorePokemon, notFound);
  } else if (this.length === 0) {
    handleNoResults(foundPokemon, pokedexContainer, loadMorePokemon, notFound);
  } 
});


searchInput.addEventListener('keyup', async function() {
  if (this.value.length < 3) return;

  await handleSearchPokemon();
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

