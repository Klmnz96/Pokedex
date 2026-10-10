let pokemonList = [];
let currentOffset = 0;
let currentDialogIndex = 0;
let displayedPokemonList = [];
let fetchCache = {};

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
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
  );
  const listData = await listResponse.json();

  for (const pokemonListItem of listData.results) {
    const detailResponse = await fetch(pokemonListItem.url);
    const detailData = await detailResponse.json();
    pokemonList.push(detailData);
  }

  currentOffset += 20;
  renderPokemonList(pokemonList);
  setLoading(false);
}

async function loadMorePokemon() {
  const loadMoreButton = document.querySelector(".load-more-btn");

  loadMoreButton.addEventListener("click", function () {
    fetchPokemon(currentOffset);
  });
}

function setSearchMode(isSearching) {
  const loadMoreButton = document.querySelector('[data-id="load-more-button"]');
  const backButton = document.querySelector(".back-btn");

  if (isSearching) {
    loadMoreButton.classList.add("hidden");
    backButton.classList.remove("hidden");
  } else {
    loadMoreButton.classList.remove("hidden");
    backButton.classList.add("hidden");
  }
}

async function fetchData(url) {
  if (fetchCache[url]) {
    return fetchCache[url];
  }

  const response = await fetch(url);
  const data = await response.json();
  fetchCache[url] = data;
  return data;
}

function isPokemonStillShown(pokemon) {
  return displayedPokemonList[currentDialogIndex] === pokemon;
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

function showNeighbourPokemon(step) {
  let newIndex = currentDialogIndex + step;

  if (newIndex < 0) {
    newIndex = displayedPokemonList.length - 1;
  }
  if (newIndex >= displayedPokemonList.length) {
    newIndex = 0;
  }
  openPokemonDialog(newIndex);
}

function setupDialogNavButtons() {
  const prevButton = document.querySelector('[data-id="prev-button"]');
  const nextButton = document.querySelector('[data-id="next-button"]');

  prevButton.addEventListener("click", function () {
    showNeighbourPokemon(-1);
  });
  nextButton.addEventListener("click", function () {
    showNeighbourPokemon(1);
  });
}

function renderPokemonList(pokemonList) {
  displayedPokemonList = pokemonList;
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
      openPokemonDialog(i);
    });
  }
}

function openPokemonDialog(index) {
  currentDialogIndex = index;
  const pokemon = displayedPokemonList[index];
  const dialog = document.querySelector('[data-id="dialog"]');

  dialog.innerHTML = getPokemonDialogTemplate(pokemon);
  dialog.className = "pokemon-dialog";
  dialog.showModal();
  renderSpeciesDetails(pokemon);
  renderMoves(pokemon);
  document.body.classList.add("no-scroll");
  setupDialogTabs();
  setupCloseDialogButton(dialog);
  setupDialogNavButtons();
}

function setupCloseDialogButton(dialog) {
  const closeDialogButton = document.querySelector(
    '[data-id="close-dialog-button"]',
  );

  closeDialogButton.addEventListener("click", function () {
    dialog.close();
  });
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

function getTypeBadgesHtml(pokemon) {
  let typeBadgesHtml = "";
  for (const typeEntry of pokemon.types) {
    typeBadgesHtml += getTypeBadgeTemplate(typeEntry.type.name);
  }
  return typeBadgesHtml;
}

function getMovePowerText(power) {
  if (power === null) {
    return "-";
  }
  return power;
}

function getMovePowerClass(power) {
  if (power === null) {
    return "power-none";
  }
  return getStatBarClass(power);
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

async function renderMoves(pokemon) {
  let movesHtml = "";

  for (const moveEntry of pokemon.moves.slice(0, 10)) {
    const moveData = await fetchData(moveEntry.move.url);
    movesHtml += getMoveTemplate(moveData);
  }

  if (!isPokemonStillShown(pokemon)) return;
  document.querySelector(".moves-tab").innerHTML = movesHtml;
}

async function renderEvolutionChain(speciesData, pokemon) {
  const evolutionData = await fetchData(speciesData.evolution_chain.url);
  const evolutionNames = getEvolutionNames(evolutionData);
  let evolutionHtml = "";

  for (const name of evolutionNames) {
    const stagePokemon = await fetchData(
      `https://pokeapi.co/api/v2/pokemon/${name}`,
    );
    evolutionHtml += getEvolutionStageTemplate(stagePokemon);
  }
  if (!isPokemonStillShown(pokemon)) return;
  document.querySelector(".evo-chain-tab").innerHTML = evolutionHtml;
}

async function renderSpeciesDetails(pokemon) {
  const speciesData = await fetchData(pokemon.species.url);
  if (!isPokemonStillShown(pokemon)) return;
  document.querySelector(".breeding-details").innerHTML =
    getBreedingTemplate(speciesData);
  renderEvolutionChain(speciesData, pokemon);
}

function getGenderText(genderRate) {
  if (genderRate === -1) {
    return "Genderless";
  }

  const femalePercent = (genderRate / 8) * 100;
  const malePercent = 100 - femalePercent;
  return `♂ ${malePercent}% ♀ ${femalePercent}%`;
}

function getEggGroupsText(eggGroups) {
  let eggGroupNames = [];
  for (const eggGroupEntry of eggGroups) {
    eggGroupNames.push(eggGroupEntry.name);
  }

  return eggGroupNames.join(", ");
}

function getAbilitiesText(abilities) {
  let abilitiesList = [];
  for (const abilityEntry of abilities) {
    abilitiesList.push(abilityEntry.ability.name);
  }
  return abilitiesList.join(", ");
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
  const searchForm = document.querySelector(".search-bar");

  updateSearchButton(searchInput, searchButton);
  setupBackButton(searchInput, searchButton);
  searchInput.addEventListener("input", function () {
    updateSearchButton(searchInput, searchButton);
  });
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    filterPokemon(searchInput.value);
  });
}

function setupBackButton(searchInput, searchButton) {
  const backButton = document.querySelector(".back-btn");

  backButton.addEventListener("click", function () {
    searchInput.value = "";
    updateSearchButton(searchInput, searchButton);
  });
}

function updateSearchButton(searchInput, searchButton) {
  const isValidSearchLength = searchInput.value.length >= 3;
  searchButton.disabled = !isValidSearchLength;

  if (searchInput.value.length === 0) {
    renderPokemonList(pokemonList);
    setSearchMode(false);
  }
}

function filterPokemon(searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();

  const filteredPokemonList = pokemonList.filter(function (pokemon) {
    return pokemon.name.toLowerCase().includes(lowerSearchTerm);
  });

  renderPokemonList(filteredPokemonList);
  setSearchMode(true);
}

init();
