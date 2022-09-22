<script>
export default {
  name: "ComboImage",
};
</script>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { getCard, error } from "../compostables/useCards";
const props = defineProps(["name"]);

const card = computed(() => getCard(props.name));
const loading = ref(true);
const imageElement = ref();

watchEffect(() => {
  if (props.name) {
    loading.value = true;
  }
});

watchEffect(() => {
  if (card.value.image !== "" && imageElement.value) {
    imageElement.value.onload = () => {
      loading.value = false;
    };
  }
});
</script>

<template>
  <a :href="card.url" target="_blank">
    <div class="background">
      <div class="loader" v-show="loading && !error">
        <span :aria-busy="loading"></span>
      </div>
      <div class="loader" v-show="error"><span>An error ocurred</span></div>
      <img
        v-show="!loading && !error"
        :src="card.image"
        ref="imageElement"
        :alt="name"
      />
      <small>${{ card.price }}</small>
    </div>
  </a>
</template>

<style scoped>
img,
.loader {
  width: 200px;
  height: 279.19px;
}
.loader {
  background-color: var(--dropdown-background-color);
  border: 0.5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.background {
  background-color: var(--dropdown-background-color);
  border-radius: 8px;
  width: 200px;
}
a {
  text-decoration: none;
  color: var(--primary);
}
small {
  display: block;
  text-align: center;
  font-size: 0.7em;
}
</style>
