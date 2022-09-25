<script>
export default { name: "NavBar" };
</script>

<script setup>
import VueFeather from "vue-feather";
import { RouterLink } from "vue-router";
import { isXs } from "../composables/useBreakPoints";
</script>
<template>
  <nav class="container-fluid">
    <ul>
      <li><RouterLink to="/">Deck Check(logo)</RouterLink></li>
    </ul>
    <ul v-if="isXs" class="vertical-center">
      <li role="list" dir="rtl">
        <a href="#" aria-haspopup="listbox" class="secondary"
          ><VueFeather type="menu" size="1em"
        /></a>
        <ul
          role="listbox"
          style="
            align-self: flex-start;
            margin-top: calc(
              1em + var(--nav-link-spacing-vertical) + var(--outline-width)
            );
          "
        >
          <li><RouterLink to="about">About</RouterLink></li>
          <li><RouterLink to="format">Format</RouterLink></li>
          <li>
            <a href="https://github.com/BrettOrmsby/deck-combo">Github</a>
          </li>
        </ul>
      </li>
    </ul>
    <ul v-else class="vertical-center">
      <li><RouterLink to="about">About</RouterLink></li>
      <li><RouterLink to="format">Format</RouterLink></li>
      <li><a href="https://github.com/BrettOrmsby/deck-combo">Github</a></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--card-background-color);
  border-bottom: var(--border-width) solid var(--muted-border-color);
}
.vertical-center > li {
  display: flex;
  align-items: center;
}
</style>
