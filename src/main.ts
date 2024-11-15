import { createApp } from 'vue';
import './index.css';
import App from './App.vue';
import router from "./router";
import { createConvexVue } from "@convex-vue/core";
import { clerkPlugin } from 'vue-clerk'
// import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';

const pinia = createPinia();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

const convexVue = createConvexVue({
    convexUrl: import.meta.env.VITE_CONVEX_URL,
});

const app = createApp(App);

app
    .use(clerkPlugin, {
        publishableKey: PUBLISHABLE_KEY,
        routerPush: router.push,
        routerReplace: router.replace,
        afterSignOutUrl: '/sign-in',
    })

    .use(pinia)
    .use(router)
    .use(convexVue)
    // .use(VueQueryPlugin)
    .mount("#app");
