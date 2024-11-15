import { Ref, computed, createApp, ref } from 'vue';
import { Resources } from '@clerk/types';

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
const app = createApp(App);

app.use(clerkPlugin, {
    publishableKey: PUBLISHABLE_KEY,
    routerPush: router.push,
    routerReplace: router.replace,
    afterSignOutUrl: '/sign-in',
})

const authState: { isLoading: Ref<boolean>; session: Ref<Resources['session']> } = {
    isLoading: ref(true),
    session: ref(undefined)
};
app.config.globalProperties.$clerk.addListener(arg => {
    authState.isLoading.value = false;
    authState.session.value = arg.session;
});

const convexVue = createConvexVue({
    convexUrl: import.meta.env.VITE_CONVEX_URL,
    auth: {
        isAuthenticated: computed(() => !!authState.session.value),
        isLoading: authState.isLoading,
        getToken: async ({ forceRefreshToken }) => {
            try {
                return await authState.session.value?.getToken({
                    template: 'convex',
                    skipCache: forceRefreshToken
                });
            } catch (error) {
                return null;
            }
        },
    }
});

app
    .use(pinia)
    .use(router)
    .use(convexVue)
    // .use(VueQueryPlugin)
    .mount("#app");
