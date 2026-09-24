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
  <div class="dialog-details">
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
  </div>
  </div>
  `;
}
