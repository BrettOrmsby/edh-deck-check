<script>
export default {
  name: "SymbolText",
};
</script>

<script setup>
import { computed } from "vue";
import { store } from "../../composables/store.js";
const props = defineProps(["text"]);
const matchedInput = computed(() =>
  props.text.trim().match(/(?:(?:(?!\{.+?\})[\s\S])+)|\{.+?\}/g)
);

const loadSymbols = async () => {
  try {
    store.manaSymbolsLoad = true;
    const symbolResponse = await fetch("https://api.scryfall.com/symbology");
    const symbolData = await symbolResponse.json();
    const symbolMap = {};
    symbolData.data.forEach((e) => {
      symbolMap[e.symbol] = e.svg_uri;
      symbolMap[e.symbol.toLowerCase()] = e.svg_uri;
    });
    store.manaSymbols = symbolMap;
  } catch (e) {
    console.log(e);
  }
};

if (!store.manaSymbolsLoad) {
  loadSymbols();
}
</script>

<template>
  <span>
    <template v-for="(match, index) of matchedInput" :key="index">
      <img
        v-if="/\{.+?\}/.test(match)"
        class="symbol"
        :alt="match.slice(1, -1)"
        :src="store.manaSymbols[match]"
      />
      <span v-else>{{ match }}</span>
    </template>
  </span>
</template>
