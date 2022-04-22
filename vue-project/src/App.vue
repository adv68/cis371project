<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/products">Products</router-link> |
      <router-link to="/history">Order History</router-link> |
      <router-link v-if="!loggedIn" to="/login">Login</router-link>
      <router-link v-if="loggedIn" to="/logout">Logout</router-link> | 
      <router-link to="/cart">&#128722;:{{numItemsInCart}}</router-link>
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
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, db } from "./firebase"
  import { collection, onSnapshot, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";

  export default class App extends Vue {
    private loggedIn = false;
    private firestoreStopListen: any;
    private numItemsInCart = 0;

    mounted() {
      onAuthStateChanged(auth, () => {
        this.numItemsInCart = 0;
        if (this.firestoreStopListen != null) {
          this.firestoreStopListen();
        }
        if (auth?.currentUser != null) {
          this.loggedIn = true;

          this.firestoreStopListen = onSnapshot(collection(db, "userdata", auth.currentUser.uid, "cart"), (ss: QuerySnapshot) => {
            let cartCounter = 0;
            ss.docs.forEach((dss: QueryDocumentSnapshot) => {
              cartCounter += dss.get("qty") as number;
            });
            this.numItemsInCart = cartCounter;
          })
        } else {
          this.loggedIn = false;
        }
      });
    }
  }
</script>

