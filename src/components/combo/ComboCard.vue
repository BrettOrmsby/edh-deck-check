<script>
export default {
  name: "ComboDropDown",
};
</script>

<script setup>
import CardLink from "./CardLink.vue";
import { store } from "../../composables/store.js";
const props = defineProps(["combo"]);

const openModal = () => {
  store.modalCombo = props.combo;
  store.showModal = true;
};
</script>

<template>
  <div
    style="
      padding-left: var(--block-spacing-horizontal);
      padding-right: var(--block-spacing-horizontal);
    "
  >
    <article style="white-space: pre-line" @click="openModal()">
      <header class="flex">
        <div v-for="(card, index) in combo.cards" :key="index">
          <CardLink :name="card" />
        </div>
      </header>
      {{ combo.result.split(".").join(".\n").trim() }}
    </article>
  </div>
</template>

<style scoped>
article {
  cursor: pointer;
  width: 300px;
}
.flex {
  display: flex;
  flex-direction: column;
}
</style>
