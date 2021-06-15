import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "firebase";

Vue.config.productionTip = false;

const firebaseConfig = {
    apiKey: "AIzaSyC7KA2JtV1GsdhqB87p2jEdL9Aa3d2TIqk",
    authDomain: "coffee-time-10ecd.firebaseapp.com",
    projectId: "coffee-time-10ecd",
    storageBucket: "coffee-time-10ecd.appspot.com",
    messagingSenderId: "312236598469",
    appId: "1:312236598469:web:c7164b0b11bd21b5f67cac"
};

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
export const appAuth = firebase.auth();
let app
appAuth.onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            render: (h) => h(App),
        }).$mount("#app");
    }
})

