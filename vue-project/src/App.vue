<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/products">Products</router-link> |
      <router-link v-if="!loggedIn" to="/login">Login</router-link>
      <router-link v-if="loggedIn" to="/logout">Logout</router-link> | 
      <router-link to="/CheckOut">Check out</router-link> 
    </nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script lang="ts">
  import { Vue } from "vue-class-component";
  import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
  import { auth } from "./firebase"

  export default class App extends Vue {
    private loggedIn = false;

    mounted() {
      onAuthStateChanged(auth, () => {
        if (auth?.currentUser != null) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      })
    }
  }
</script>

