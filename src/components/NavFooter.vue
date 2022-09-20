<script>
export default {
  name: "NavFooter",
};
</script>

<template>
  <footer class="container-fluid">
    <nav class="space-around">
      <ul>
        <li><RouterLink to="/" class="secondary">Deck Check</RouterLink></li>
        <li><RouterLink to="about" class="secondary">About</RouterLink></li>
        <li><RouterLink to="format" class="secondary">Format</RouterLink></li>
        <li><a href="https://github.com/BrettOrmsby/deck-combo" class="secondary">Github</a></li>
      </ul>
    </nav>
  </footer>
</template>

<style scoped>
footer {
  background-color: var(--card-background-color);
  border-top: var(--border-width) solid var(--muted-border-color);
}
.space-around {
  justify-content: space-around;
}
</style>
