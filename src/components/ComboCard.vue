<script>
export default {
  name: "ComboDropDown",
};
</script>

<script setup>
import CardLink from "./CardLink.vue";
import { modal } from "../compostables/store.js";
const props = defineProps(["combo"]);

const openModal = () => {
  modal.modalCombo = props.combo;
  modal.showModal = true;
};
</script>

<template>
  <div
    class="col-xs-12 col-sm-6 col-md-6 col-lg-4"
    style="
      padding-left: var(--block-spacing-horizontal);
      padding-right: var(--block-spacing-horizontal);
    "
  >
    <article style="white-space: pre-line" @click="openModal()">
      <header>
        <CardLink
          v-for="(card, index) in combo.cards"
          :key="index"
          :name="card"
        />
      </header>
      {{ combo.result.split(".").join(".\n").trim() }}
    </article>
  </div>
</template>

<style scoped>
article {
  cursor: pointer;
}
</style>
