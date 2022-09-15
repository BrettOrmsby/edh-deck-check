import { reactive } from "vue";

export const modal = reactive({
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

export const cards = reactive({
  cards: {},
});
