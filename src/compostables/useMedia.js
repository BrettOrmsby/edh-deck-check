import { ref } from "vue";

export const useMedia = (query) => {
  const media = window.matchMedia(query);
  const match = ref(media.matches);
  media.addEventListener("change", () => (match.value = media.matches));
  return match;
};
