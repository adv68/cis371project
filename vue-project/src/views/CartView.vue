<template>
    <div>
        <h1>Cart</h1>

        <CartProduct v-for="(cartitem, pos) in cartProducts" :key="pos" :id="cartitem.product.id" :costPerItem="cartitem.product.price" :qty="cartitem.qty" :name="cartitem.product.name" :numInStock="cartitem.product.numInStock"/>

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
import { collection, DocumentSnapshot, getDocs, onSnapshot, QuerySnapshot, DocumentChange } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { CartItem } from '../types';
import { Unsubscribe } from '@firebase/util';

@Options({
    components: {
        CartProduct
    }
})
export default class CartView extends Vue {
    private cartProducts: Array<CartItem> = [];
    private unsubscribe: Unsubscribe | null = null;

    mounted() {
        if (auth.currentUser != null) {
            this.unsubscribe = onSnapshot(collection(db, "products"), (qs: QuerySnapshot) => {
                qs.docChanges().forEach((docChng: DocumentChange) => {
                    if (docChng.type == "modified") {
                        const cartItemToUpdate = this.cartProducts.find((cItem: CartItem) => cItem.product.id == docChng.doc.id);
                        if (cartItemToUpdate != null) {
                            cartItemToUpdate.product.price = docChng.doc.get("price");
                            cartItemToUpdate.product.numInStock = docChng.doc.get("inStock");
                        }
                    }
                });
            });

            getDocs(collection(db, "userdata", auth.currentUser.uid, "cart"))
                .then((qs_cart: QuerySnapshot) => {
                    const products = collection(db, "products");
                    getDocs(products)
                        .then((qs_prod: QuerySnapshot) => {
                            qs_cart.docs.forEach((ds: DocumentSnapshot) => {
                                const itemData = ds.data();
                                const itemProduct = qs_prod.docs.find((d) => d.id == ds.id);
                                if (itemData != null && itemProduct != null) {
                                    this.cartProducts.push({
                                        product: {
                                            id: itemProduct.id,
                                            description: itemProduct.get("description"),
                                            imageUrl: itemProduct.get("image"),
                                            name: itemProduct.get("name"),
                                            price: itemProduct.get("price"),
                                            numInStock: itemProduct.get("inStock")
                                        },
                                        qty: ds.get("qty")
                                    });
                                }
                            });
                        });
                });
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }
    }

    unmounted() {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    }
}
</script>
