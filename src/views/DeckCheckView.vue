<script setup>
import { RouterLink } from "vue-router";
import { ref, watchEffect, onMounted } from "vue";
import ComboList from "../components/ComboList.vue";
import ComboModule from "../components/ComboModal.vue";
import { store } from "../compostables/store.js";
import {getCard, loading, error} from "../compostables/useCards"

const loadingCombo = ref(true);
const errorCombo = ref(false);
const combos = ref([]);
const deckText = ref("Heliod, Sun-Crowned\nWalking Ballista");
const deckIdentity = ref([]);
const almostCombosInDeck = ref([]);
const combosInDeck = ref([]);

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
  const onlyInDeck = deck.split("SIDEBOARD:")[0];
  const cards = onlyInDeck
    .split(/\n/g)
    .filter((e) => e.trim() !== "")
    .map((e) => {
      e = e.replace(
        /^\s*(?:\d+(?:x|X)?\s*?)?([\s\S]*?)([(*][\s\S]*?)?$/gm,
        "$1"
      );
      return e.trim();
    });
  let finalCards = [];
  for (let card of cards) {
    if (card.includes("//")) {
      finalCards = [...finalCards, ...card.split("//").map((e) => e.trim())];
    }
    finalCards.push(card);
  }
  return finalCards;
};

const findCombos = async (deck) => {
  let identity = []
  for(let cardName of deck) {
    const card = getCard(cardName)
    if(!card) {
      console.warn("Card not found: " + cardName) 
      continue
    }
    const cardIdentity = card.colourId
    identity = [
      ...new Set([...identity, ...cardIdentity]),
    ]
  }
  identity = identity.map(e=> e.toLowerCase())
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
  if(!loadingCombo.value && !loading.value && !errorCombo.value && !error.value) {
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
        <textarea v-model="deckText" rows="8" style="resize: none" placeholder="Enter your deck"></textarea>
        <small class="center"
          >View <RouterLink to="format">format</RouterLink> rules</small
        >

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
