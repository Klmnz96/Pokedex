function getPokemonCardTemplate(pokemon) {
  const mainType = pokemon.types[0].type.name;

  let typeBadgesHtml = "";
  for (const typeEntry of pokemon.types) {
    typeBadgesHtml += `
    <span class="type-badge">
    <img src="./assets/icons/${typeEntry.type.name}.svg" alt="" class="type-icon" />
    <span class="type-name">${typeEntry.type.name}</span>
    </span>
    `;
  }

  return `
    <li>
    <button data-id="card" class="pokemon-card" aria-label="Show details for ${pokemon.name}">
    <h3 class="pokemon-name">${pokemon.name}</h3>
    <div class="pokemon-image-wrap ${mainType}">
    <img data-id="card-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />
    </div>
    <div class="type-badges">${typeBadgesHtml}</div>
    </button>
    </li>
    `;
}

function getPokemonDialogTemplate(pokemon) {
  const mainType = pokemon.types[0].type.name;
  let abilitiesList = [];
  for (const abilityEntry of pokemon.abilities) {
    abilitiesList.push(abilityEntry.ability.name);
  }
  const abilitiesText = abilitiesList.join(", ");

  return `
  <div data-id="overlay-pokemon-name">
  <button data-id="close-dialog-button">Close</button>
  <div class="dialog-header ${mainType}">
  <img src="./assets/icons/pokeball-dark.svg" alt="" class="dialog-pokeball-bg" />
  <img data-id="dialog-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />
  <h2 class="pokemon-name">${pokemon.name}</h2>
  </div>

  <div class="dialog-tabs">
  <button class="tab-btn active" aria-label="show main info">Main</button>
  <button class="tab-btn" aria-label="show stats">Stats</button>
  <button class="tab-btn" aria-label="show evolution chain">Evo chain</button>
  <button class="tab-btn" aria-label="show moves">Moves</button>
  </div>

  <div class="dialog-details tab-content">
  <div class="detail-row">
  <span class="detail-label">Height:</span>
  <span class="detail-value">${pokemon.height * 10} cm</span>
  </div>
  <div class="detail-row">
  <span class="detail-label">Weight:</span>
  <span class="detail-value">${pokemon.weight / 10} kg</span>
  </div>
  <div class="detail-row">
  <span class="detail-label">Base Experience:</span>
  <span class="detail-value">${pokemon.base_experience}</span>
  </div>
  <div class="detail-row">
  <span class="detail-label">Abilities:</span>
  <span class="detail-value">${abilitiesText}</span>
  </div>
  <h3 class="breeding-title">Breeding</h3>
  <div class="breeding-details">Loading breeding info...</div>
  </div>

  <div class="stats-tab tab-content hidden">
  ${getStatsTemplate(pokemon)}
  </div>

  <div class="evo-chain-tab tab-content hidden">
  loading evolution chain ...
  </div>

  <div class="moves-tab tab-content hidden">
  ${getMovesTemplate(pokemon)}
  </div>

  </div>
  `;
}

function getStatsTemplate(pokemon) {
  let statsHtml = "";

  for (const statEntry of pokemon.stats) {
    statsHtml += `
    <div class="detail-row">
    <span class="detail-label">${statEntry.stat.name}</span>
    <span class="detail-value">${statEntry.base_stat}</span>
    <div class="stat-bar">
    <div class="stat-bar-fill ${getStatBarClass(statEntry.base_stat)}" style="width: ${statEntry.base_stat}%"></div>
    </div>
    </div>
    `;
  }

  return statsHtml;
}

function getBreedingTemplate(speciesData) {
  return `
  <div class="detail-row">
  <span class="detail-label">Gender: </span>
  <span class="detail-value">${getGenderText(speciesData.gender_rate)}</span>
  </div>
  <div class="detail-row">
  <span class="detail-label">Egg Groups: </span>
  <span class="detail-value">${getEggGroupsText(speciesData.egg_groups)}</span>
  </div>
  <div class="detail-row">
  <span class="detail-label">Egg Cycles: </span>
  <span class="detail-value">${speciesData.hatch_counter}</span>
  </div>`;
}

function getEvolutionStageTemplate(stagePokemon) {
  return `
  <div class="evo-stage">
  <img src="${stagePokemon.sprites.other["official-artwork"].front_default}" alt="${stagePokemon.name}"/>
  <span class="evo-name">${stagePokemon.name}</span>
  </div>
  `;
}

function getMovesTemplate(pokemon) {
  let movesHtml = "";

  for (const moveEntry of pokemon.moves.slice(0, 10)) {
    movesHtml += `<span class="move-badge">${moveEntry.move.name}</span>`;
  }

  return movesHtml;
}
