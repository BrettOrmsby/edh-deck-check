<script>
export default {
  name: "CardLink",
};
</script>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { addCards } from "../compostables/useCards";
import CardImage from "./CardImage.vue";
const props = defineProps(["name"]);

addCards([props.name]);

const a = ref();
const revealed = ref(false);

const toggleOn = () => {
  revealed.value = true;
};
const toggleOff = () => {
  revealed.value = false;
};

onMounted(() => {
  a.value.addEventListener("mouseenter", toggleOn);
  a.value.addEventListener("mouseleave", toggleOff);
});

onUnmounted(() => {
  a.value?.removeEventListener("mouseenter", toggleOn);
  a.value?.removeEventListener("mouseleave", toggleOff);
});
//addEventListener('mouseleave', (event) => {})
/* const specifiedElement = document.getElementById("a");

document.addEventListener("click", (event) => {
  const isClickInside = specifiedElement.contains(event.target);

  if (!isClickInside) {
    // ...
  }
});
*/
//element.removeEventListener
</script>

<template>
  <a ref="a">{{ name }}</a>
  <div class="relative">
    <div class="absolute">
      <CardImage v-if="revealed" :name="name" />
    </div>
  </div>
</template>

<style scoped>
.relative {
  z-index: 9;
  position: relative;
}
.absolute {
  position: absolute;
  bottom: 2em;
}
</style>
