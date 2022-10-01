import { ref } from "vue";

const loading = ref(true);
const error = ref(false);
const cards = ref([]);

const loadCards = async () => {
  let bulkData;
  try {
    const bulkResponse = await fetch("https://api.scryfall.com/bulk-data");
    bulkData = await bulkResponse.json();
  } catch (e) {
    console.log(e);
    loading.value = false;
    error.value = true;
    return;
  }

  let bulkCards;
  try {
    const bulkCardsResponse = await fetch(
      bulkData.data.find((e) => (e.name = "Oracle Cards")).download_uri
    );
    bulkCards = await bulkCardsResponse.json();
  } catch (e) {
    console.log(e);
    loading.value = false;
    error.value = true;
    return;
  }

  const cardsArr = [];
  for (let card of bulkCards) {
    if (
      card.set_type === "token" ||
      card.set_type === "memorabilia" ||
      card.legalities.commander !== "legal"
    ) {
      continue;
    }
    let images = card.image_uris;
    if (!images && card.card_faces) {
      images = card.card_faces[0].image_uris;
    }
    cardsArr.push({
      name: card.name
        .toLowerCase()
        // Commander spellbook only used the first part of a card
        .split(" // ")[0]
        // inconsistent punctuation
        .replace(/[^\w\s]/g, ""),
      image: images.png,
      url: card.scryfall_uri,
      price: card.prices.usd,
      colourId: card.color_identity,
    });
  }
  cards.value = cardsArr;
  loading.value = false;
};

loadCards();

const getCard = (cardName) => {
  if (!loading.value && !error.value) {
    return cards.value.find((e) => {
      return (
        e.name ===
        cardName
          .toLowerCase()
          // Commander spellbook only used the first part of a card
          .split(" // ")[0]
          // inconsistent punctuation
          .replace(/[^\w\s]/g, "")
      );
    });
  }
};

export { loading, error, cards, getCard };
