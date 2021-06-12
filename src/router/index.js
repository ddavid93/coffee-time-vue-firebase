import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/",
    name: "coffeeList",
    component: () => import("../components/coffee/list"),
  },
  {
    path: "/auth/register",
    name: "register",
    component: () => import("../components/auth/register"),
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import("../components/auth/login")
  },
  {
    path: "/coffee/log",
    name: "coffeeLog",
    component: () => import("../components/coffee/logCoffees"),
  },
  {
    path: "/user/list",
    name: "userList",
    component: () => import("../components/user-management/userList"),
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});


export default router;
