function generatePokemonCardHTML(pokeData, typeClass) {
    return /*html*/ `
    <div class="pokemonCard" onclick="showPokemonCardFullscreen(${pokeData.id})">
      <div class="numberDiv">
        <span class="number"><p style="font-family: Arial, Helvetica, sans-serif;">#</p>${pokeData.id.toString().padStart(3, "0")}</span>
      </div>
      <span class="pokemonName"><span>${pokeData.name.charAt(0).toUpperCase()}</span>${pokeData.name.slice(1)}</span>
      <div class=" ${typeClass} pokemonBackground">
        <img class="pokemonImg" src="${pokeData.sprites.other.dream_world.front_default}" alt="${pokeData.name}" />
      </div>
      <div class="infoType">    
          <span>${pokeData.types.map((type) => type.type.name).join(", ")}</span> 
      </div>
    </div>
  `;
  }
  
  function generateFullscreenCardHTML(pokeData) {
    let typeClasses = pokeData.types.map((typeInfo) => typeInfo.type.name);
    let typeClass = getTypeClass(typeClasses);
    let statsClasses = pokeData.stats.map((stat) => getStatClass([stat.stat.name]));
    let statBarClasses = pokeData.stats.map((stat) => getStatClassBar([stat.stat.name]));
    return /*html*/`
        <div class="arrowns">
          <div class="prevCard" onclick="prevCard()">PREV</div>
          <div class="closeButtonDiv">
            <div class="closeButton" onclick="closeFullscreen()">x</div>
          </div>
          <div class="nextCard" onclick="nextCard()">NEXT</div>
        </div>
        <div class="nameDIv">
          <span class="numberFullscreen"><p style="font-family: Arial, Helvetica, sans-serif;">#</p>${pokeData.id.toString().padStart(3, "0")}</span>
          <span class="nameFullscreen"><span>${pokeData.name.charAt(0).toUpperCase()}</span>${pokeData.name.slice(1)}</span>
        </div>
        <div style="display: flex; justify-content: center;">
          <div class="${typeClass} typeBackgroundFullscreen">
            <img class="pokemonImgFullscreen" src="${pokeData.sprites.other.dream_world.front_default}" alt="${pokeData.name}" />
          </div>
        </div>
        <div class="infoBox">
          <div class="infoNavbar">
            <div class="navButton" onclick="displayInfoDiv()">Info</div>
            <div class="navButton" onclick="displayMovesDiv()">Moves</div>
            <div class="navButton" onclick="displayStatsDiv()">Stats</div>
          </div>
          <div id="infoDiv" class="infoDiv">    
            <div class="info"><b class="infotext">Type:</b>${pokeData.types.map((type) => type.type.name).join(", ")}</div> 
            <div class="info"><b class="infotext">Abilities:</b><span class="abilitiesText">${pokeData.abilities.map((ability) => ability.ability.name).join(", ")}</span></div>
            <div class="info"><b class="infotext">Height:</b>${formatHeight(pokeData.height)} m</div> 
            <div class="info"><b class="infotext">Weight:</b>${formatWeight(pokeData.weight)} kg</div> 
            <div class="info"><b class="infotext">Base experience:</b>${pokeData.base_experience} xp</div> 
          </div>
          <div id="movesDiv" class="movesDiv" style="display: none;">
            <div class="info"><b class="infotext">Moves:</b>
            ${pokeData.moves.slice(0, 24).map((move) => move.move.name).join(", ")}
            </div>
        </div>
          <div id="statsDiv" class="statsDiv" style="display: none;">
        <div class="chart">
          ${pokeData.stats.map((stat, index) => /*html*/`
            <div class="${statsClasses[index]}">
              <div>${stat.stat.name}:</div>
              <div class="${statBarClasses[index]}" style="width: ${stat.base_stat}px;">${stat.base_stat}</div>
            </div>
          `).join('')}
        </div>
          `;
    }