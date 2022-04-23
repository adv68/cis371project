<template>
  <div class="home">
    <h1>Welcome to the Store!</h1>
    <div id="grid">
      <div @click="goToCart()">
        <h1>&#128722;</h1>
        <p>Go To Cart</p>
      </div>
      <div @click="goToOrders()">
        <h1>&#128193;</h1>
        <p>Previous Orders</p>
      </div>
      <div @click="goToProducts()">
        <h1>&#127980;</h1>
        <p>Go Shopping</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .home {
    width: 80%;
    max-width: 500px;
    margin: 0 auto;
  }

  #grid {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    gap: 0.5%;
  }

  #grid > div {
    border-radius: 10px;
  }

  #grid > div:hover {
    background-color: #dddddd;
  }

  div > * {
    text-align: center;
  }
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '../components/HelloWorld.vue';

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {
  goToCart() {
    this.$router.push({name: "cart"});
  }

  goToOrders() {
    this.$router.push({name: "orderhistory"});
  }

  goToProducts() {
    this.$router.push({name: "products"});
  }
}
</script>
