<template>
    <div>
        <h1>Cart</h1>

        <CartProduct v-for="(cartitem, pos) in cartProducts" :key="pos" :id="cartitem.id" :costPerItem="cartitem.costPerItem" :qty="cartitem.qty" :name="cartitem.name"/>

        <button v-if="cartProducts.length > 0" @click="this.$router.push({ name: 'checkout' })">Check Out</button>

        <h2 v-if="cartProducts.length == 0">Your cart is empty</h2>
    </div>
</template>

<style scoped>
    div {
        margin: 0 auto;
        width: 80%;
        max-width: 500px;
    }
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CartProduct from '../components/CartProduct.vue';
import { collection, DocumentSnapshot, getDocs, QuerySnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

@Options({
    components: {
        CartProduct
    }
})
export default class CartView extends Vue {
    private cartProducts: Array<CartItem> = [];

    mounted() {
        if (auth.currentUser != null) {
        
            const userCartItems = collection(db, "userdata", auth.currentUser.uid, "cart");
            getDocs(userCartItems)
                .then((qs_cart: QuerySnapshot) => {
                    const products = collection(db, "products");
                    getDocs(products)
                        .then((qs_prod: QuerySnapshot) => {
                            qs_cart.docs.forEach((ds: DocumentSnapshot) => {
                                const itemData = ds.data();
                                const itemProductData = qs_prod.docs.find((d) => d.id == ds.id)!.data();
                                if (itemData != null) {
                                    this.cartProducts.push({
                                        id: ds.id,
                                        costPerItem: itemProductData.price,
                                        qty: itemData.qty,
                                        name: itemProductData.name
                                    });
                                }
                            })
                        })
                })
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }
    }
}

type CartItem = {
    id: string,
    costPerItem: number,
    qty: number,
    name: string
}
</script>
