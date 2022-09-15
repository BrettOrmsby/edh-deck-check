import { ref, watchEffect } from "vue";
import { cards, modal } from "./store.js";
import * as scryfall from "scryfall-client";

const addCards = async (cardNames) => {
  const identifiers = cardNames
    .filter((e) => !(e in cards.cards))
    .map((e) => {
      return { name: e };
    });
  try {
    const collection = await scryfall.getCollection(identifiers);
    collection.forEach((e) => {
      cards.cards[e.name] = e.image_uris.png;
    });
  } catch (e) {
    console.log(e.message);
  }
};

const getImage = (cardName) => {
  const imageURL = ref("");

  watchEffect(() => {
    if (cardName in cards.cards) {
      imageURL.value = cards.cards[cardName];
    }
  });
  return imageURL;
};

watchEffect(() => {
  addCards(modal.modalCombo.cards);
});

export { addCards, getImage };
