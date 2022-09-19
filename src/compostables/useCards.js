import { ref, watchEffect } from "vue";
import { cards, modal } from "./store.js";
import * as scryfall from "scryfall-client";
let loadingCards = [];

const addCards = async (cardNames) => {
  const identifiers = cardNames
    .filter((e) => !loadingCards.includes(e))
    .map((e) => {
      return { name: e };
    });
  loadingCards = [...new Set([...cardNames, ...loadingCards])];
  if (identifiers.length === 0) {
    return;
  }
  try {
    const collection = await scryfall.getCollection(identifiers);
    let allCards = [...collection];
    // some cards might not be found in the collection (Beck // Call)
    for (let notFound of collection.not_found) {
      allCards.push(await scryfall.getCard(notFound.name, "exactName"));
    }
    allCards.forEach((e) => {
      if (e.name.includes("//") && !e.image_uris?.png) {
        let names = e.name.split("//").map((n) => n.trim());
        for (let name of names) {
          if (cardNames.includes(name) || cardNames.includes(e.name)) {
            const card = e.card_faces.find((face) => face.name === name);
            cards.cards[card.name] = card.image_uris.png;
          }
        }
      } else {
        cards.cards[e.name] = e.image_uris.png;
      }
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
