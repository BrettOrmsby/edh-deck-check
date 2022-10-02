<script setup>
/*
 * TODO:
 * title/meta
 * name
 * if on mobile the card tooltips should go top
 */
import ComboList from "./combo/ComboList.vue";
import ComboModal from "./combo/ComboModal.vue";
import { ref, watchEffect, onMounted } from "vue";
import { store } from "../composables/store.js";
import { getCard, loading, error } from "../composables/useCards";

const loadingCombo = ref(true);
const errorCombo = ref(false);
const combos = ref([]);
const deckText = ref("");
const lazyDeckText = ref("");
const almostCombosInDeck = ref([]);
const combosInDeck = ref([]);
const unfoundCards = ref([]);

// Need to click the button before showing the combos to reduce glitching if it went onchange
const clickSinceLastEdit = ref(false);

onMounted(async () => {
  let data;
  try {
    const response = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1KqyDRZRCgy8YgMFnY0tHSw_3jC99Z0zFvJrPbfm66vA/values:batchGet?ranges=combos!A2:Q&key=AIzaSyBD_rcme5Ff37Evxa4eW5BFQZkmTbgpHew"
    );
    data = await response.json();
  } catch (e) {
    loadingCombo.value = false;
    errorCombo.value = true;
    console.log(e);
    return;
  }
  combos.value = data.valueRanges[0].values
    .map((e) => {
      return {
        id: e[0],
        cards: e.slice(1, 11).filter((e) => e !== ""),
        identity: e[11]?.split(","),
        before: e[12],
        howTo: e[13],
        result: e[14],
      };
    })
    .filter((e) => e.cards.length > 0);
  loadingCombo.value = false;
});

const deckToCards = (deck) => {
  // support for pasting from MoxField
  const onlyInDeck = deck.split("SIDEBOARD:")[0];

  const cards = onlyInDeck
    .split(/\n/g)
    // remove empty spaces
    .filter((e) => e.trim() !== "")
    // remove `\d?x` before card name for TappedOut and `(.+?)` for set names and `*.+?*` for commanders/foils for TappedOut
    .map((e) => {
      e = e.match(/^\s*(?:\d+(?:x|X)?)?\s*([\s\S]*?)([(*][\s\S]*?)?$/)[1];
      return e.trim();
    });
  return cards;
};

const findCombos = async (deck) => {
  let identity = [];
  for (let cardName of deck) {
    const card = getCard(cardName);
    if (!card) {
      unfoundCards.value.push(cardName);
      continue;
    }
    const cardIdentity = card.colourId;
    identity = [...new Set([...identity, ...cardIdentity])];
  }
  identity = identity.map((e) => e.toLowerCase());
  main: for (let combo of combos.value) {
    for (let colour of combo.identity) {
      if (colour !== "c" && !identity.includes(colour)) {
        continue main;
      }
    }
    let numberCardsNotInDeck = 0;
    let tempCardsNotInDeck = [];
    for (let card of combo.cards) {
      if (!deck.includes(card)) {
        numberCardsNotInDeck += 1;
        tempCardsNotInDeck.push(card);
        if (numberCardsNotInDeck > 1) {
          continue main;
        }
      }
    }
    store.cardsNotInDeck = [
      ...new Set([...store.cardsNotInDeck, ...tempCardsNotInDeck]),
    ];
    if (numberCardsNotInDeck === 1) {
      almostCombosInDeck.value.push(combo);
    } else {
      combosInDeck.value.push(combo);
    }
  }
};

const updateTextarea = (textarea) => {
  clickSinceLastEdit.value = false;
  deckText.value = textarea.value;
};

watchEffect(() => {
  if (
    clickSinceLastEdit.value &&
    !loadingCombo.value &&
    !loading.value &&
    !errorCombo.value &&
    !error.value
  ) {
    const deckList = deckToCards(deckText.value);
    unfoundCards.value = [];
    almostCombosInDeck.value = [];
    combosInDeck.value = [];
    store.cardsNotInDeck = [];
    findCombos(deckList);
  }
});

const scrollToTitle = () => {
  document.querySelector("h2").scrollIntoView({
    behavior: "smooth",
  });
};
</script>
<template>
  <ComboModal />
  <main class="container">
    <img class="header" src="../assets/images/johnny-combo-player.jpeg" />

    <hgroup>
      <h1 data-theme="dark">Combo Checker</h1>
      <p>How many combos do you have in your EDH deck?</p>
      <svg
        @click="scrollToTitle()"
        role="link"
        class="secondary"
        viewBox="0 0 24 24"
        width="2em"
        height="2em"
        stroke="var(--color)"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </hgroup>
    <h2 class="heading">Enter Your Deck List</h2>
    <textarea
      :value="deckText"
      rows="8"
      style="resize: none"
      :placeholder="'1 Heliod, Sun-Crowned\n1x Walking Ballista (2XM)'"
      @input="updateTextarea($event.target)"
      @change="($event) => (lazyDeckText = $event.target.value)"
    ></textarea>
    <div v-if="unfoundCards.length > 0">
      <p>Invalid commander legal cards:</p>
      <ul>
        <li v-for="(card, index) of unfoundCards" :key="index">{{ card }}</li>
      </ul>
    </div>
    <button
      v-show="!clickSinceLastEdit"
      @click="() => (clickSinceLastEdit = true)"
      id="button"
    >
      Find Combos
    </button>
    <h2>Combos In Deck</h2>
    <ComboList
      :combos="combosInDeck"
      :is-loading="loadingCombo || loading"
      :is-error="errorCombo || error"
      :deck-text="lazyDeckText"
    />
    <h2>Close Combos</h2>
    <ComboList
      :combos="almostCombosInDeck"
      :is-loading="loadingCombo || loading"
      :is-error="errorCombo || error"
      :deck-text="lazyDeckText"
    />
  </main>
</template>

<style scoped>
h2 {
  text-align: center;
}
.header {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: -1;
  height: 100vh;
  filter: brightness(35%);
}
hgroup {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
}
hgroup p {
  --color: var(--muted-color);
  --font-weight: unset;
  font-size: 1rem;
  font-family: unset;
}

.heading {
  padding-top: var(--block-spacing-vertical);
}
</style>
