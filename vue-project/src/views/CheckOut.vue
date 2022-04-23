<template>
    <div id="gridCont">
        <h1>Checkout</h1>

        <div id="grid">
            <div>
                <h2>Shipping</h2>
                <table>
                    <td>
                        <tr>Name:</tr>
                        <tr>Address:</tr>
                        <tr>City:</tr>
                        <tr>Zipcode:</tr>
                    </td>
                    <td>
                        <tr><input type="text" min="" v-model.lazy="custName"/></tr>
                        <tr><input type="text" v-model.lazy="custAddress"/></tr>
                        <tr><input type="text" v-model.lazy="custCity"/></tr>
                        <tr><input type="text" v-model.lazy="custZip"/></tr>
                    </td>
                </table>

                <h2>Billing</h2>
                <table>
                    <td>
                        <tr>Card Number:</tr>
                        <tr>Expiration Date:</tr>
                        <tr>CVC Code:</tr>
                        <tr>Cardholder:</tr>
                    </td>
                    <td>
                        <tr><input type="text" min="" v-model.lazy="cardNum"></tr>
                        <tr><input type="text" min="" v-model.lazy="cardExp"></tr>
                        <tr><input type="text" min="" v-model.lazy="cardCVC"></tr>
                        <tr><input type="text" min="" v-model.lazy="cardName"></tr>
                    </td>
                </table>
            </div>
            <div>
                <h2>Your Order</h2>

                <p v-for="(item, pos) in cartProducts" :key="pos">({{item.qty <= item.product.numInStock ? item.qty : item.product.numInStock}}) {{item.product.name}} - ${{(item.product.price * (item.qty <= item.product.numInStock ? item.qty : item.product.numInStock)).toFixed(2)}}</p>

                <h3>Total: ${{cartProducts.map((item) => (item.product.price * (item.qty <= item.product.numInStock ? item.qty : item.product.numInStock))).reduce((p, c) => p + c, 0).toFixed(2)}}</h3>
            </div>
        </div>

        <button @click="submit" :disabled="custName == '' || custAddress == '' || custCity == '' || custZip == '' || cardNum.length < 16 || cardExp == '' || cardCVC == '' || cardName == ''">Submit Order</button>
    </div>
</template>

<style scoped>
    #gridCont {
        width: 80%;
        max-width: 600px;
        margin: 0 auto;
    }

    #grid {
        display: grid;
        grid-template-columns: 98%;
        gap: 1%;
    }

    #grid > div {
        border: 1px solid #2c3e50;
    }

    table {
        margin-top: 8px;
        margin-right: 8px;
        display: table;
        text-align: left;
        border:2px solid black;
        background-color: #aaaaaa;
        width:fit-content;
    }
    tr, td {
        height:2.5ch;
    }
    @media screen and (min-width: 400px) {
       #grid {
            grid-template-columns: 50% 50%;
        }
    }
</style>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { collection, getDocs, QuerySnapshot, QueryDocumentSnapshot, addDoc, deleteDoc, doc, updateDoc, onSnapshot, DocumentChange, DocumentSnapshot} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Unsubscribe } from '@firebase/util';
import { CartItem } from '../types';

export default class CheckoutView extends Vue {
    custName = "";
    custAddress = "";
    custCity = "";
    custZip = "";
    cardNum = "";
    cardExp = "";
    cardCVC = "";
    cardName = "";

    private unsubscribe: Unsubscribe | null = null;
    private cartProducts: Array<CartItem> = [];

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

    submit() {
        if (auth.currentUser != null) {
            this.cartProducts.forEach((item: CartItem) => {
                updateDoc(doc(db, "products", item.product.id), {inStock: (item.qty < item.product.numInStock ? item.product.numInStock - item.qty : 0)});
            });  

            addDoc(collection(db, "userdata", auth.currentUser.uid, "orders"), {
                shippingName: this.custName,
                shippingAddress: `${this.custAddress} ${this.custCity} ${this.custZip}`,
                cardNum: `************${this.cardNum.substring(12)}`,
                cardholder: this.cardName,
                items: this.cartProducts.map((item: CartItem) => ({id: item.product.id, qty: (item.qty < item.product.numInStock ? item.qty : item.product.numInStock)}))
            }).then(() => {
                if (auth.currentUser != null) {
                    getDocs(collection(db, "userdata", auth.currentUser.uid, "cart"))
                        .then((qs: QuerySnapshot) => {
                            qs.forEach((qds: QueryDocumentSnapshot) => {
                                deleteDoc(qds.ref);
                            });
                        });
                }
                
            });
           
            this.$router.push({ name: "home"});
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }
    }
}
</script>
