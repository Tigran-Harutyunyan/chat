import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from 'vue-router';

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
  },
  { path: '/:pathMatch(.*)*', redirect: '/workspace' }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


// import { createWebHistory, createRouter } from "vue-router";

// const routes = [
//   { path: "/sign-in", component: () => import("./views/SignInView.vue") },
//   { path: "/sign-up", component: () => import("./views/SignUpView.vue") },
//   {
//     path: "/workspace/",
//     component: () => import("./views/workspace/WorkspaceView.vue"),
//   },
//   {
//     path: "/workspace/:workspaceId",
//     component: () => import("./views/workspace/WorkspaceIdView.vue"),
//   },
//   {
//     path: "/workspace/:workspaceId/channel/:channelId",
//     component: () => import("./views/workspace/ChannelView.vue"),
//   },
//   {
//     path: "/workspace/:workspaceId/member/:memberId",
//     component: () => import("./views/workspace/MemberidView.vue"),
//   },
//   {
//     path: "/join/:workspaceId",
//     component: () => import("./views/JoinWorkspaceView.vue"),
//   },
//   { path: '/:pathMatch(.*)*', redirect: '/workspace' }
// ];
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;
