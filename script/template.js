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
    <button data-id="card" class="pokemon-card ${mainType}" aria-label="Show details for ${pokemon.name}">
    <img data-id="card-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />
    <h3 class="pokemon-name">${pokemon.name}</h3>
    <div class="type-badges">${typeBadgesHtml}</div>
    </button>
    </li>
    `;
}
