let allPokemon = [];
let currentIndex;
let batchSize = 20;
let startIndex = 0;
let cardIndex;


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
  if (cardIndex > 0) {
    cardIndex--;
    showPokemonCardFullscreen(cardIndex);
  }
}

function nextCard() {
  if (cardIndex < allPokemon.length) {
    cardIndex++;
    showPokemonCardFullscreen(cardIndex);
  }
}

function renderFirstBatchOfPokemon() {
  let pokedex = document.getElementById("pokedex");
  const pokemonBatch = allPokemon.slice(0, 20);

  pokemonBatch.forEach((pokemon, index) => {
    let typeClasses = pokemon.types.map((typeInfo) => typeInfo.type.name);
    let typeClass = getTypeClass(typeClasses);
    let pokeInnerHTML = generatePokemonCardHTML(pokemon, typeClass, index);
    pokedex.innerHTML += pokeInnerHTML;
    currentIndex = index + 1;
  });
}

function renderPokemon(currentIndex, endIndex) {
  let pokedex = document.getElementById("pokedex");
  const pokemonBatch = allPokemon.slice(currentIndex, endIndex);

  pokemonBatch.forEach((pokemon, batchIndex) => {
    let typeClasses = pokemon.types.map((typeInfo) => typeInfo.type.name);
    let typeClass = getTypeClass(typeClasses);
    let index = currentIndex + batchIndex;
    let pokeInnerHTML = generatePokemonCardHTML(pokemon, typeClass, index);
    pokedex.innerHTML += pokeInnerHTML;
  });
}

 function renderSearchedPokemon(pokeData, index) {
  let foundPokemon = document.getElementById("foundPokemon");
  let typeClasses = pokeData.types.map((typeInfo) => typeInfo.type.name);
  let typeClass = getTypeClass(typeClasses);
  let pokeInnerHTML = generatePokemonCardHTML(pokeData, typeClass, index);
  foundPokemon.innerHTML += pokeInnerHTML;
  
}

function filterPokemonBySearch(searchInput) {
    let pokemons = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchInput)
  );
  return pokemons;
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
  loadMorePokemon.style.visibility = 'hidden';
}

function renderFoundPokemon(filteredPokemon, foundPokemon, pokedexContainer, loadMorePokemon, notFound) {
  foundPokemon.innerHTML = "";
  filteredPokemon.forEach((pokemon) => {
    let pokeIndex = pokemon.id - 1;
    renderSearchedPokemon(pokemon, pokeIndex);
    notFound.style.display = "none";
    pokedexContainer.style.display = "none";
    foundPokemon.style.display = "flex";
    loadMorePokemon.style.visibility = 'hidden'
  });
}

function handleSearchPokemon() {
  let searchInput = document.getElementById("searchPokemon").value.toLowerCase();
  let filteredPokemon = filterPokemonBySearch(searchInput);
  let foundPokemon = document.getElementById("foundPokemon");
  let pokedexContainer = document.getElementById("pokedexContainer");
  let loadMorePokemon = document.getElementById("loadMorePokemon");
  let notFound = document.getElementById("notFound");

    if (searchInput.length === 0) {
      handleEmptySearch(foundPokemon, pokedexContainer, loadMorePokemon, notFound);
    } else if (searchInput.length < 3) {
    } else {
      if (filteredPokemon.length === 0) {
        handleNoResults(foundPokemon, pokedexContainer, loadMorePokemon, notFound);
      } else {
        renderFoundPokemon(filteredPokemon, foundPokemon, pokedexContainer, loadMorePokemon, notFound);
      }
    }
  };

  const searchInput = document.getElementById("searchPokemon")
  searchInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^a-zA-Z]/g, "");
});

function showPokemonCardFullscreen(index) {
  let fullscreenBackground = document.getElementById("fullscreenBackground");
  let fullscreenCard = document.getElementById("fullscreenCard");
  fullscreenBackground.style.display = "flex";

  let pokeData = allPokemon[index];

  let typeClasses = pokeData.types.map((typeInfo) => typeInfo.type.name);
  let typeClass = getTypeClass(typeClasses);
  let pokeInnerHTML = generateFullscreenCardHTML(pokeData, typeClass);

  fullscreenCard.innerHTML = pokeInnerHTML;
  cardIndex = index; 
  disableButton(cardIndex);
}

function closeFullscreen() {
  let fullscreenBackground = document.getElementById("fullscreenBackground");
  let fullscreenCard = document.getElementById("fullscreenCard");
  fullscreenBackground.style.display = "none";
  fullscreenCard.innerHTML = "";
}

async function init() {
  showLoadingScreen();

  try {
    await fetch500Pokemons();
    renderFirstBatchOfPokemon();
  } finally {
    hideLoadingScreen();
  }

  const loadMoreButton = document.getElementById("loadMorePokemon");
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", loadMorePokemons);
  } else {
    console.error("Button 'loadMorePokemon' nicht gefunden.");
  }
}

function loadMorePokemons() {
  const endIndex = currentIndex + batchSize;
  renderPokemon(currentIndex, endIndex);
  currentIndex = endIndex;
}

function hideLoadingScreen() {
  let loadingScreen = document.getElementById('LoadingScreen');
  loadingScreen.style.display = 'none';
}

function showLoadingScreen() {
  let loadingScreen = document.getElementById('LoadingScreen');
  loadingScreen.style.display = 'block';
}

function disableButton(cardIndex) {
  let prevCard = document.getElementById('prevCard');
  let nextCard = document.getElementById('nextCard');

  if (cardIndex === 0) {
    prevCard.classList.add('disablePrev');
  } else if (cardIndex === 499) {
    nextCard.classList.add('disableNext');
  }
}

