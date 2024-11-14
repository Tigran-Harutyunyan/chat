import { createWebHistory, createRouter } from "vue-router";
import HomeView from "./views/HomeView.vue";

const routes = [
  { path: "/", component: HomeView, },
  { path: "/sign-in", component: () => import("./views/SignInView.vue") },
  { path: "/sign-up", component: () => import("./views/SignUpView.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
