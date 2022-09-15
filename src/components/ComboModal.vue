<script>
export default {
  name: "ComboModal",
};
</script>

<script setup>
import CardImage from "./CardImage.vue";
import { modal } from "../compostables/store.js";
import { ref, computed } from "vue";

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
      <ol>
        <li
          v-for="(before, index) in modal.modalCombo.before.split(/\.(?!$)/g)"
          :key="index"
        >
          {{ before.replace(".", "") }}.
        </li>
      </ol>
      <h4>Steps</h4>
      <ol>
        <li
          v-for="(step, index) in modal.modalCombo.howTo.split(/\.(?!$)/g)"
          :key="index"
        >
          {{ step.replace(".", "") }}.
        </li>
      </ol>
      <h4>Result</h4>
      <ul>
        <li
          v-for="(result, index) in modal.modalCombo.result.split(/\.(?!$)/g)"
          :key="index"
        >
          {{ result.replace(".", "") }}.
        </li>
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
