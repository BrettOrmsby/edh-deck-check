<script>
export default {
  name: "ComboImage",
};
</script>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { getImage } from "../compostables/useCards";
const props = defineProps(["name"]);

const image = computed(() => getImage(props.name));
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
  <div class="loader" v-show="loading"><span :aria-busy="loading"></span></div>
  <img v-show="!loading" :src="image.value" ref="imageElement" />
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
