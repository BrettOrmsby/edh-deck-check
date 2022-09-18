<script>
export default {
  name: "ComboModal",
};
</script>

<script setup>
import CardImage from "./CardImage.vue";
import { modal } from "../compostables/store.js";
import { ref, computed } from "vue";
import * as scryfall from "scryfall-client";

const clickedOff = ref(true);
const close = () => {
  if (clickedOff.value === false) {
    clickedOff.value = true;
  } else {
    modal.showModal = false;
  }
};
const clickOn = () => {
  clickedOff.value = false;
};

const header = computed(() => {
  return (
    [...modal.modalCombo.cards].splice(0, 2).join(" | ") +
    (modal.modalCombo.cards.length >= 3 ? "..." : "")
  );
});

const formatHTML = (text) => {
  if (!text) {
    return "";
  }
  return text
    .trim()
    .split(/\.(?!$)/g)
    .map((e) => "<li>" + replaceSymbols(e.replace(".", "")) + ".</li>")
    .join("");
};

const replaceSymbols = (text) => {
  let matches = text.match(/{(.)(\/(.))?}/g);
  if (matches) {
    matches.forEach((symbol) => {
      let key = symbol.slice(1, -1);
      text = text.replace(
        symbol,
        '<img class="symbol" src="' + scryfall.getSymbolUrl(key) + '"/>'
      );
    });
  }
  return text;
};
</script>

<template>
  <dialog @click="close()" :open="modal.showModal">
    <article @click="clickOn()">
      <header>
        <a @click="close()" aria-label="Close" class="close"></a>
        {{ header }}
      </header>
      <h4>Cards</h4>
      <div class="cardsContainer">
        <CardImage
          v-for="(card, index) of modal.modalCombo.cards"
          :key="index"
          :name="card"
        />
      </div>
      <h4>Prerequisites</h4>
      <ul v-html="formatHTML(modal.modalCombo.before)"></ul>
      <h4>Steps</h4>
      <ol v-html="formatHTML(modal.modalCombo.howTo)">
      </ol>
      <h4>Result</h4>
      <ul v-html="formatHTML(modal.modalCombo.result)">
      </ul>
      <footer>
        <a
          target="_blank"
          :href="`https://www.commanderspellbook.com/combo/${modal.modalCombo.id}/`"
          role="button"
          >Commander Spell Book</a
        >
      </footer>
    </article>
  </dialog>
</template>

<style scoped>
.cardsContainer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  row-gap: calc(var(--block-spacing-horizontal) / 2);
  column-gap: calc(var(--block-spacing-vertical) / 2);
  margin-bottom: var(--typography-spacing-vertical);
}
</style>
