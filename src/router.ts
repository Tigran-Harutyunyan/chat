import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from 'vue-router';
import { useUser } from "@/store/useUser";
import { storeToRefs } from "pinia";

const routes: Array<RouteRecordRaw> = [
  { path: "/sign-in", component: () => import("./views/SignInView.vue"), meta: { layout: 'AuthLayout' } },
  { path: "/sign-up", component: () => import("./views/SignUpView.vue"), meta: { layout: 'AuthLayout' } },
  {
    path: "/workspace/",
    component: () => import("./views/workspace/WorkspaceView.vue"),
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: "/workspace/:workspaceId",
    component: () => import("./views/workspace/WorkspaceIdView.vue"),
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: "/workspace/:workspaceId/channel/:channelId",
    component: () => import("./views/workspace/ChannelView.vue"),
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: "/workspace/:workspaceId/member/:memberId",
    component: () => import("./views/workspace/MemberidView.vue"),
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: "/join/:workspaceId",
    component: () => import("./views/JoinWorkspaceView.vue"),
    meta: { layout: 'JoinWorkspaceLayout' }
  },
  { path: '/:pathMatch(.*)*', redirect: '/workspace' }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const { isSignedIn } = storeToRefs(useUser());

  if (to.meta.requiresAuth && isSignedIn.value !== undefined && !isSignedIn.value) {
    next('/sign-in');
  } else {
    next();
  }
})

export default router;