import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/tape/:id",
    name: "tape-detail",
    component: () =>
      import(/* webpackChunkName: "tape-detail" */ "../views/TapeDetail.vue"),
  },
  {
    path: "/browse",
    name: "tape-list",
    component: () =>
      import(/* webpackChunkName: "tape-list" */ "../views/TapeList.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue"),
    beforeEnter: (to, from, next) => {
      if (store.state.loggedIn) {
        next({ name: "user-info" });
      }
      next();
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    beforeEnter: (to, from, next) => {
      if (store.state.loggedIn) {
        next({ name: "user-info" });
      }
      next();
    },
  },
  {
    path: "/artist/create",
    name: "artist-profile-creation",
    component: () =>
      import(
        /* webpackChunkName: "artist-profile" */ "../views/ArtistProfileCreation.vue"
      ),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/artist/:id",
    name: "artist-profile",
    component: () =>
      import(
        /* webpackChunkName: "artist-profile" */ "../views/ArtistProfile.vue"
      ),
  },
  {
    path: "/userinfo",
    name: "user-info",
    component: () =>
      import(
        /* webpackChunkName: "user-info" */ "../views/UserInformation.vue"
      ),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/tape-upload",
    name: "tape-upload",
    component: () =>
      import(/* webpackChunkName: "tape-upload" */ "../views/TapeUpload.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/user-tapes",
    name: "user-tapes",
    component: () =>
      import(/* webpackChunkName: "my-tapes" */ "../views/UserTapes.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/admin",
    name: "acp",
    component: () =>
      import(/* webpackChunkName: "acp" */ "../views/acp/Dashboard.vue"),
    meta: {
      requireAuth: true,
      constraint: () => store.getters.ability.can("view", "acp"),
    },
  },
  {
    path: "/timeout",
    name: "timeout-error",
    component: () =>
      import(
        /* webpackChunkName: "timeout-error" */ "../views/TimeoutError.vue"
      ),
  },
  {
    path: "/access-denied",
    name: "access-denied",
    component: () =>
      import(
        /* webpackChunkName: "server-error" */ "../views/AccessDenied.vue"
      ),
  },
  {
    path: "/*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
  {
    path: "/:status",
    name: "server-error",
    component: () =>
      import(/* webpackChunkName: "server-error" */ "../views/ServerError.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !store.state.loggedIn) {
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }
  if (to.meta.constraint instanceof Function && !to.meta.constraint()) {
    next({
      name: "access-denied",
    });
  }
  next();
});

export default router;
