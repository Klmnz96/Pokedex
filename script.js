let pokemonList = [];
let currentOffset = 0;

function init() {
  scrollHeader();
  fetchPokemon(currentOffset);
  searchPokemon();
  loadMorePokemon();
  closeDialogOnOutsideClick();
  unlockScrollOnDialogClose();
}

async function fetchPokemon(offset) {
  setLoading(true);
  const listResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=40&offset=${offset}`,
  );
  const listData = await listResponse.json();

  for (const pokemonListItem of listData.results) {
    const detailResponse = await fetch(pokemonListItem.url);
    const detailData = await detailResponse.json();
    pokemonList.push(detailData);
  }

  currentOffset += 40;
  renderPokemonList(pokemonList);
  setLoading(false);
}

async function loadMorePokemon() {
  const loadMoreButton = document.querySelector(".load-more-btn");

  loadMoreButton.addEventListener("click", function () {
    fetchPokemon(currentOffset);
  });
}

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function fetchEvolutionChain(pokemon) {
  const speciesData = await fetchData(pokemon.species.url);
  const evolutionData = await fetchData(speciesData.evolution_chain.url);
  return evolutionData;
}

function setLoading(isLoading) {
  const loadingScreen = document.querySelector(".loading-screen");
  const loadMoreButton = document.querySelector(".load-more-btn");

  if (isLoading) {
    loadingScreen.classList.remove("hidden");
  } else {
    loadingScreen.classList.add("hidden");
  }

  loadMoreButton.disabled = isLoading;
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
  setupPokemonDialog();
}

function setupPokemonDialog() {
  const cardButtons = document.querySelectorAll('[data-id="card"]');

  for (let i = 0; i < cardButtons.length; i++) {
    cardButtons[i].addEventListener("click", function () {
      const clickedPokemon = pokemonList[i];

      const dialog = document.querySelector('[data-id="dialog"]');
      dialog.innerHTML = getPokemonDialogTemplate(clickedPokemon);
      dialog.className = "pokemon-dialog";
      dialog.showModal();
      renderEvolutionChain(clickedPokemon);
      document.body.classList.add("no-scroll");
      setupDialogTabs();
      const closeDialogButton = document.querySelector(
        '[data-id="close-dialog-button"]',
      );
      closeDialogButton.addEventListener("click", function () {
        dialog.close();
      });
    });
  }
}

function closeDialogOnOutsideClick() {
  const dialog = document.querySelector('[data-id="dialog"]');

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function unlockScrollOnDialogClose() {
  const dialog = document.querySelector('[data-id="dialog"]');

  dialog.addEventListener("close", function () {
    document.body.classList.remove("no-scroll");
  });
}

function setupDialogTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const dialogTabs = document.querySelectorAll(".tab-content");

  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
      for (let j = 0; j < dialogTabs.length; j++) {
        dialogTabs[j].classList.add("hidden");
        tabButtons[j].classList.remove("active");
      }

      dialogTabs[i].classList.remove("hidden");
      tabButtons[i].classList.add("active");
    });
  }
}

function getStatBarClass(statValue) {
  if (statValue < 50) {
    return "stat-low";
  }
  return "stat-high";
}

function getEvolutionNames(evolutionData) {
  let evolutionNames = [];
  let currentStage = evolutionData.chain;

  while (currentStage) {
    evolutionNames.push(currentStage.species.name);
    currentStage = currentStage.evolves_to[0];
  }

  return evolutionNames;
}

async function renderEvolutionChain(pokemon) {
  const evolutionData = await fetchEvolutionChain(pokemon);
  const evolutionNames = getEvolutionNames(evolutionData);
  let evolutionHtml = "";

  for (const name of evolutionNames) {
    const stagePokemon = await fetchData(
      `https://pokeapi.co/api/v2/pokemon/${name}`,
    );
    evolutionHtml += getEvolutionStageTemplate(stagePokemon);
  }

  document.querySelector(".evo-chain-tab").innerHTML = evolutionHtml;
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
