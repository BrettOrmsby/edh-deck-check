import { createRouter, createWebHistory } from "vue-router";
import DeckCheckView from "../views/DeckCheckView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "deck-combo",
      component: DeckCheckView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/format",
      name: "format",
      component: () => import("../views/FormatView.vue"),
    },
  ],
});

export default router;
