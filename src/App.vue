<style>
li {
  padding: 10px 10px 0 0;
}
</style>
<template>
  <div>
    <nav class="navbar navbar-expand-md navbar navbar-dark bg-dark">
      <div class="container">
        <router-link to="/" class="navbar-brand" v-if="!!authenticated">Hello: {{ user.data.displayName }}</router-link>
        <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto"></ul>
          <ul class="navbar-nav ml-auto">
            <template v-if="!!user && !!user.loggedIn">
              <li class="nav-item">
                <router-link class="nav-link" to="/"
                >Coffee Handling
                </router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/user/list"
                >User Handling
                </router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/coffee/log"
                >Coffee Logs
                </router-link
                >
              </li>
              <li class="nav-item pointer">
                <a class="nav-link" @click.prevent="signOut">Logout</a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item pointer">
                <router-link to="login" class="nav-link">Login</router-link>
              </li>
              <li class="nav-item pointer">
                <router-link to="register" class="nav-link">Register</router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
    <br>
    <h4 class="text-center">Coffee Time Test for Yanovis</h4>
    <div class="container mt-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
import {appAuth} from "./main";

export default {
  computed: {
    authenticated() {
      return !!this.user && this.user.loggedIn
    },
    firstName() {
      if (this.user.data.displayName) {
        return this.user.data.displayName.split(' ')[0]
      }
      return null
    }
  },
  mounted: function () {
    appAuth.onAuthStateChanged(user => {
      if (user) {
        this.user.loggedIn = true;
        this.user.data = user;
      } else {
        this.user.loggedIn = false;
        this.user.data = {};
      }
    })
  },
  data() {
    return {
      user: {
        loggedIn: false,
        data: {}
      }
    }
  },
  methods: {
    signOut() {
      firebase.auth().signOut().then(() => {
        this.$router.push("/auth/login");
      });
    }
  }
};
</script>
