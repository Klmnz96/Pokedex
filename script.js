function init() {
  scrollHeader();
  fetchPokemon();
}

async function fetchPokemon() {
  const listResponse = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0",
  );
  const listData = await listResponse.json();

  const pokemonList = [];

  for (const pokemonListItem of listData.results) {
    const detailResponse = await fetch(pokemonListItem.url);
    const detailData = await detailResponse.json();
    pokemonList.push(detailData);
  }

  renderPokemonList(pokemonList);
}

function renderPokemonList(pokemonList) {
  let pokemonGridHtml = "";

  for (const pokemon of pokemonList) {
    pokemonGridHtml += getPokemonCardTemplate(pokemon);
  }

  document.querySelector(".pokemon-grid").innerHTML = pokemonGridHtml;
}

function scrollHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => header.classList.toggle("scrolled", window.scrollY > 50);

  update();
  window.addEventListener("scroll", update, { passive: true });
}

init();
