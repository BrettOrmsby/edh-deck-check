<script setup>
import ComboList from "../components/combo/ComboList.vue";
import ComboModule from "../components/combo/ComboModal.vue";
import { ref, watchEffect, onMounted } from "vue";
import { store } from "../composables/store.js";
import { getCard, loading, error } from "../composables/useCards";

const loadingCombo = ref(true);
const errorCombo = ref(false);
const combos = ref([]);
const deckText = ref("");
const almostCombosInDeck = ref([]);
const combosInDeck = ref([]);

// Need to click the button before showing the combos to reduce glitching if it went onchange
const clickSinceLastEdit = ref(false);

onMounted(async () => {
  const response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1KqyDRZRCgy8YgMFnY0tHSw_3jC99Z0zFvJrPbfm66vA/values:batchGet?ranges=combos!A2:Q&key=AIzaSyBD_rcme5Ff37Evxa4eW5BFQZkmTbgpHew"
  );
  if (!response.ok) {
    console.log(`An error has occurred: ${response.status}`);
    loadingCombo.value = false;
    errorCombo.value = true;
    return;
  }
  const data = await response.json();
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
      console.warn("Card not found: " + cardName);
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

watchEffect(() => {
  if (
    clickSinceLastEdit.value &&
    !loadingCombo.value &&
    !loading.value &&
    !errorCombo.value &&
    !error.value
  ) {
    const deckList = deckToCards(deckText.value);
    almostCombosInDeck.value = [];
    combosInDeck.value = [];
    store.cardsNotInDeck = [];
    findCombos(deckList);
  }
});
</script>
<template>
  <ComboModule />
  <main class="container">
    <hgroup>
      <h1>Combo Checker</h1>
      <p>Check your EDH deck for its combos and close combos missing 1 card!</p>
    </hgroup>
    <textarea
      v-model="deckText"
      rows="8"
      style="resize: none"
      :placeholder="'Enter your deck.\n\n1 Heliod, Sun-Crowned\n1x Walking Ballista'"
      @input="() => (clickSinceLastEdit = false)"
    ></textarea>
    <button @click="() => (clickSinceLastEdit = true)">Find Combos</button>
    <h3>Combos In Deck</h3>
    <ComboList
      :combos="combosInDeck"
      :is-loading="loadingCombo || loading"
      :is-error="errorCombo || error"
    />
    <h3>Close Combos In Deck</h3>
    <ComboList
      :combos="almostCombosInDeck"
      :is-loading="loadingCombo || loading"
      :is-error="errorCombo || error"
    />
  </main>
</template>
