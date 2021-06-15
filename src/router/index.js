import Vue from "vue";
import VueRouter from "vue-router";
import {appAuth} from "../main";

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
        meta: {
            authRequired: true,
        },
    },
    {
        path: "/auth/register",
        name: "register",
        component: () => import("../components/auth/register"),
    },
    {
        path: '/auth/login',
        name: 'login',
        component: () => import("../components/auth/login"),
    },
    {
        path: "/coffee/log",
        name: "coffeeLog",
        component: () => import("../components/coffee/logCoffees"),
        meta: {
            authRequired: true,
        },
    },
    {
        path: "/user/list",
        name: "userList",
        component: () => import("../components/user-management/userList"),
        meta: {
            authRequired: true,
        },
    },
];
const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.authRequired)) {
        let user = appAuth.currentUser
        if (!user) {
            next({name: 'login'})
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
