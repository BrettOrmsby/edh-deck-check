<script>
export default {
  name: "ComboList",
};
</script>

<script setup>
import ComboCard from "./ComboCard.vue";
defineProps(["isError", "isLoading", "combos"]);
</script>
<template>
  <h4 v-if="isLoading" aria-busy="true">Loading...</h4>
  <h4 v-else-if="isError">An Error Occurred</h4>
  <h4 v-else-if="combos.length === 0">No Combos Found</h4>
  <div v-else class="flex">
    <ComboCard v-for="(combo, index) of combos" :key="index" :combo="combo" />
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
