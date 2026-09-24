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

  return `
  <div data-id="overlay-pokemon-name">
  <button data-id="close-dialog-button">Close</button>
  <div class="dialog-header ${mainType}">
  <img src="./assets/icons/pokeball-dark.svg" alt="" class="dialog-pokeball-bg" />
  <img data-id="dialog-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />
  <h2 class="pokemon-name">${pokemon.name}</h2>
  </div>
  <div class="dialog-details">
  <!-- Stats/Tabs -->
  </div>
  </div>
  `;
}
