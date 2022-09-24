<script>
export default {
  name: "ComboModal",
};
</script>

<script setup>
import CardImage from "./CardImage.vue";
import { store } from "../compostables/store.js";
import { computed, watchEffect } from "vue";
import * as scryfall from "scryfall-client";

watchEffect(() => {
  const html = document.getElementsByTagName("html")[0];
  if (store.showModal) {
    html.classList.remove("modal-is-closing");
    html.classList.add("modal-is-opening");
    html.classList.add("modal-is-open");
  } else {
    html.classList.remove("modal-is-opening");
    html.classList.add("modal-is-closing");
    html.classList.remove("modal-is-open");
  }
});

const close = () => {
  store.showModal = false;
};

const header = computed(() => {
  return (
    [...store.modalCombo.cards].splice(0, 2).join(" | ") +
    (store.modalCombo.cards.length >= 3 ? "..." : "")
  );
});

const formatHTML = (text) => {
  if (!text) {
    return "";
  }
  return text
    .trim()
    .split(/\.(?!$)/g)
    .map((e) => "<li>" + replaceSymbols(e.replace(".", "")) + "</li>")
    .join("");
};

const replaceSymbols = (text) =>
  text.replace(
    /{(.+?)}/g,
    (_, match) =>
      `<img class="symbol" alt="{${match}}" src="${scryfall.getSymbolUrl(
        match
      )}"/>`
  );
</script>

<template>
  <dialog @click.self="close()" :open="store.showModal">
    <article>
      <header>
        <a @click="close()" aria-label="Close" class="close"></a>
        {{ header }}
      </header>
      <h4>Cards</h4>
      <div class="cardsContainer">
        <CardImage
          v-for="(card, index) of store.modalCombo.cards"
          :key="index"
          :name="card"
        />
      </div>
      <h4>Prerequisites</h4>
      <ul v-html="formatHTML(store.modalCombo.before)"></ul>
      <h4>Steps</h4>
      <ol v-html="formatHTML(store.modalCombo.howTo)"></ol>
      <h4>Result</h4>
      <ul v-html="formatHTML(store.modalCombo.result)"></ul>
      <footer>
        <a
          target="_blank"
          :href="`https://www.commanderspellbook.com/combo/${store.modalCombo.id}/`"
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
