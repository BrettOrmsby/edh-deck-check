<script>
export default {
  name: "CardLink",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import CardImage from "./CardImage.vue";
import { store } from "../../composables/store.js";
import { computePosition, flip, shift } from "@floating-ui/dom";
defineProps(["name"]);

const revealed = ref(false);
const tooltip = ref();
const link = ref();

const update = () => {
  computePosition(link.value, tooltip.value, {
    placement: "right",
    middleware: [flip(), shift()],
  }).then(({ x, y }) => {
    Object.assign(tooltip.value.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
};

function showTooltip() {
  tooltip.value.style.display = "block";
  revealed.value = true;
  update();
}

function hideTooltip() {
  tooltip.value.style.display = "none";
  revealed.value = false;
}

onMounted(() => {
  [
    ["mouseenter", showTooltip],
    ["mouseleave", hideTooltip],
    ["focus", showTooltip],
    ["blur", hideTooltip],
  ].forEach(([event, listener]) => {
    tooltip.value.addEventListener(event, listener);
    link.value.addEventListener(event, listener);
  });
});
</script>

<template>
  <a
    ref="link"
    :class="{ notInDeck: store.cardsNotInDeck.includes(name) }"
    @click.stop=""
    >{{ name }}</a
  >
  <div ref="tooltip" id="tooltip" @click.stop="">
    <CardImage v-if="revealed" :name="name" />
  </div>
</template>

<style scoped>
#tooltip {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  padding-left: 0.5em;
}
.notInDeck {
  color: var(--form-element-invalid-active-border-color);
}
</style>
