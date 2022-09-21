<script>
export default {
  name: "ComboImage",
};
</script>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { getCard, error } from "../compostables/useCards";
const props = defineProps(["name"]);

const image = computed(() => getCard(props.name).image);
const loading = ref(true);
const imageElement = ref();

watchEffect(() => {
  if (props.name) {
    loading.value = true;
  }
});

watchEffect(() => {
  if (image.value !== "" && imageElement.value) {
    imageElement.value.onload = () => {
      loading.value = false;
    };
  }
});
</script>

<template>
  <div class="loader" v-show="loading && !error">
    <span :aria-busy="loading"></span>
  </div>
  <div class="loader" v-show="error"><span>An error ocurred</span></div>
  <img v-show="!loading && !error" :src="image" ref="imageElement" />
</template>

<style scoped>
img,
.loader {
  width: 200px;
  height: 279.19px;
}
.loader {
  background-color: var(--card-sectionning-background-color);
  border: 0.5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
