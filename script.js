let pokemonList = [];

function init() {
  scrollHeader();
  fetchPokemon();
  searchPokemon();
}

async function fetchPokemon() {
  const listResponse = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0",
  );
  const listData = await listResponse.json();

  for (const pokemonListItem of listData.results) {
    const detailResponse = await fetch(pokemonListItem.url);
    const detailData = await detailResponse.json();
    pokemonList.push(detailData);
  }

  renderPokemonList(pokemonList);
}

function renderPokemonList(pokemonList) {
  const pokemonGrid = document.querySelector(".pokemon-grid");

  if (pokemonList.length === 0) {
    pokemonGrid.innerHTML = `<p data-id="not-found">No Pokemon found</p>`;
    return;
  }

  let pokemonGridHtml = "";

  for (const pokemon of pokemonList) {
    pokemonGridHtml += getPokemonCardTemplate(pokemon);
  }

  pokemonGrid.innerHTML = pokemonGridHtml;
}

function scrollHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => header.classList.toggle("scrolled", window.scrollY > 50);

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function searchPokemon() {
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button");

  const updateSearchButton = () => {
    const isValidSearchLength = searchInput.value.length >= 3;
    searchButton.disabled = !isValidSearchLength;

    if (searchInput.value.length === 0) {
      renderPokemonList(pokemonList);
    }
  };

  updateSearchButton();
  searchInput.addEventListener("input", updateSearchButton);

  searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredPokemonList = pokemonList.filter(function (pokemon) {
      return pokemon.name.toLowerCase().includes(searchTerm);
    });

    renderPokemonList(filteredPokemonList);
  });
}

init();
