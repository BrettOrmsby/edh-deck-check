<script>
export default { name: "NavBar" };
</script>

<script setup>
import VueFeather from "vue-feather";
import { RouterLink } from "vue-router";
import { isXs } from "../compostables/useBreakPoints";
</script>
<template>
  <nav class="container-fluid">
    <ul>
      <li><RouterLink to="/">Deck Check(logo)</RouterLink></li>
    </ul>
    <ul v-if="isXs">
      <li role="list" dir="rtl">
        <a href="#" aria-haspopup="listbox"><VueFeather type="menu" /></a>
        <ul role="listbox">
          <li><RouterLink to="about">About</RouterLink></li>
          <li><RouterLink to="format">Format</RouterLink></li>
          <li><a href="https://github.com/BrettOrmsby">Github</a></li>
        </ul>
      </li>
    </ul>
    <ul v-else>
      <li><RouterLink to="about">About</RouterLink></li>
      <li><RouterLink to="format">Format</RouterLink></li>
      <li><a href="https://github.com/BrettOrmsby">Github</a></li>
    </ul>
  </nav>
</template>

<style>
nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--card-background-color);
  border-bottom: var(--border-width) solid var(--muted-border-color);
}
</style>
