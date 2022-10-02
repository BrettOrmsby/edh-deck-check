<script>
export default {
  name: "NavFooter",
};
</script>

<template>
  <footer class="container-fluid">
    <div>
      <p>
        {NAME} uses combo data from
        <a href="https://www.commanderspellbook.com/">Commander Spellbook</a>
        with respect to this
        <a
          href="https://github.com/Commander-Spellbook/website-v2/blob/main/LICENSE"
          >licence</a
        >. This data can be found on their public
        <a
          href="https://docs.google.com/spreadsheets/d/1KqyDRZRCgy8YgMFnY0tHSw_3jC99Z0zFvJrPbfm66vA/edit#gid=0"
          >Google Sheet</a
        >. Card and image data is from
        <a href="https://scryfall.com/">Scryfall</a>, who fallows the
        <a href="https://company.wizards.com/en/legal/fancontentpolicy"
          >Wizards of the Coast's Fan Content Policy</a
        >.
      </p>
      <p>
        The image to the top of this page,
        <a href="https://scryfall.com/card/unh/35/johnny-combo-player"
          >Johnny, Combo Player</a
        >
        can be found with proper brightness
        <a
          href="https://cards.scryfall.io/art_crop/front/e/f/eff24f82-afd6-48be-ba99-2f9e8a3d0231.jpg?1562489848"
          >here</a
        >
        and is ilistrated by
        <a href="https://www.kensukeart.com/">Kensuke Okabayashi</a>.
      </p>
      <p>
        {NAME} is unofficial and non-endorsed Fan Content permitted under
        Wizard's
        <a href="https://company.wizards.com/en/legal/fancontentpolicy"
          >Fan Content Policy</a
        >. Some content used is property of Wizards of the Coast.
      </p>
      <p>
        The source for {NAME} can be found on
        <a href="https://github.com/BrettOrmsby/deck-combo">Github</a>.
      </p>
      <p>All other content © Brett Ormsby {{ new Date().getFullYear() }}</p>
    </div>
  </footer>
</template>

<style scoped>
* {
  color: var(--muted-color);
}
footer {
  background-color: var(--card-background-color);
  border-top: var(--border-width) solid var(--muted-border-color);
  display: flex;
  justify-content: center;
  padding: 1em;
}
a {
  text-decoration: underline;
}
a:hover {
  filter: brightness(85%);
}
p {
  font-size: 0.8em;
}
div {
  max-width: 30em;
}
div *:last-child {
  margin-bottom: 0;
}
</style>
