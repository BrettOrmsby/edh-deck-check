<script setup>
import { RouterLink } from "vue-router";
import { ref, watchEffect, onMounted } from "vue";
import ComboList from "../components/ComboList.vue";
import ComboModule from "../components/ComboModal.vue";

const isLoading = ref(true);
const isError = ref(false);
const combos = ref([]);
const deckText = ref("Heliod, Sun-Crowned\nWalking Ballista");
const deckIdentity = ref([]);
const almostCombosInDeck = ref([]);
const combosInDeck = ref([]);
const cardsNotInDeck = ref([]);

onMounted(async () => {
  const response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1KqyDRZRCgy8YgMFnY0tHSw_3jC99Z0zFvJrPbfm66vA/values:batchGet?ranges=combos!A2:Q&key=AIzaSyBD_rcme5Ff37Evxa4eW5BFQZkmTbgpHew"
  );
  if (!response.ok) {
    console.log(`An error has occurred: ${response.status}`);
    isLoading.value = false;
    isError.value = true;
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
  isLoading.value = false;
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

const findCombos = (deck, identity) => {
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
    cardsNotInDeck.value = [
      ...new Set([...cardsNotInDeck.value, ...tempCardsNotInDeck]),
    ];
    if (numberCardsNotInDeck === 1) {
      almostCombosInDeck.value.push(combo);
    } else {
      combosInDeck.value.push(combo);
    }
  }
};

watchEffect(() => {
  almostCombosInDeck.value = [];
  combosInDeck.value = [];
  cardsNotInDeck.value = [];
  const deckList = deckToCards(deckText.value);
  findCombos(deckList, deckIdentity.value, combos.value);
});
</script>
<template>
  <ComboModule />
  <main class="container">
    <hgroup>
      <h1>Combo Checker</h1>
      <p>Check your EDH deck for its combos and close combos missing 1 card!</p>
    </hgroup>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <h2>Paste In You Deck</h2>
        <textarea v-model="deckText" rows="8" style="resize: none"></textarea>
        <small class="center"
          >View <RouterLink to="format">format</RouterLink> rules</small
        >
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <h2>Deck Colour Identity</h2>
        <fieldset>
          <label for="whiteIdentity"
            ><input
              type="checkbox"
              name="whiteIdentity"
              value="w"
              v-model="deckIdentity"
            />W</label
          >
          <label for="blueIdentity"
            ><input
              type="checkbox"
              name="blueIdentity"
              value="u"
              v-model="deckIdentity"
            />U</label
          >
          <label for="blackIdentity"
            ><input
              type="checkbox"
              name="blackIdentity"
              value="b"
              v-model="deckIdentity"
            />B</label
          >
          <label for="redIdentity"
            ><input
              type="checkbox"
              name="redIdentity"
              value="r"
              v-model="deckIdentity"
            />R</label
          >
          <label for="greenIdentity"
            ><input
              type="checkbox"
              name="greenIdentity"
              value="g"
              v-model="deckIdentity"
            />G</label
          >
        </fieldset>
      </div>
    </div>

    <h3>Combos In Deck</h3>
    <ComboList
      :combos="combosInDeck"
      :is-loading="isLoading"
      :is-error="isError"
    />
    <h3>Close Combos In Deck</h3>
    <ComboList
      :combos="almostCombosInDeck"
      :is-loading="isLoading"
      :is-error="isError"
    />
  </main>
</template>
