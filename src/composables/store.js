import { reactive } from "vue";

export const store = reactive({
  cardsNotInDeck: [],
  showModule: false,
  modalCombo: {
    id: 0,
    cards: [],
    identity: [],
    before: "",
    howTo: "",
    result: "",
  },
});
