import { ref } from "vue";

const manaSymbols = ref({});

const loadSymbols = async () => {
  try {
    const symbolResponse = await fetch("https://api.scryfall.com/symbology");
    const symbolData = await symbolResponse.json();
    const symbolMap = {};
    symbolData.data.forEach((e) => {
      symbolMap[e.symbol] = e.svg_uri;
      symbolMap[e.symbol.toLowerCase()] = e.svg_uri;
    });
    manaSymbols.value = symbolMap;
  } catch (e) {
    console.log(e);
  }
};

loadSymbols();

const replaceSymbol = (text) =>
  text.replace(
    /{(.+?)}/g,
    (_, match) =>
      `<img class="symbol" alt="{${match}}" src="${
        manaSymbols.value[`{${match}}`]
      }"/>`
  );

export { replaceSymbol };
