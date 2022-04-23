<template>
    <span>
    <h1>{{name}}</h1>
    <img :src="imgUrl">
    <h2>{{`$${price.toFixed(2)}`}}</h2>
    <h3>Quantity Available: {{inStock}}</h3>
    <p>{{description}}</p>

    <input type="number" min="0" :max="inStock" v-model="quantity"/>
    <button id="addToCart" @click="addToCart"  v-bind:disabled="inStock <= 0 || (inStock - quantity) < 0">Add to cart</button>
    <p v-text="message"/>
    </span>
</template>

<style scoped>
    img {
        width: 40%; 
        border-radius: 20px;
    }
</style>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { doc, DocumentSnapshot, increment, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { Unsubscribe } from '@firebase/util';

export default class ProductDetailView extends Vue {
    private id: string | string[] | null = null;
    private name = "";
    private imgName = "";
    private imgUrl = "";
    private price = 0;
    private description = "";
    private quantity = 0;
    private message = "";
    private inStock = 0;
    private unsubscribe: Unsubscribe | null = null;
    
    mounted() {
        this.id = this.$route.params.id;
        this.unsubscribe = onSnapshot(doc(db, "products", this.id as string), (snapshot: DocumentSnapshot) => {
            this.name = snapshot.get("name");
            this.inStock = snapshot.get("inStock");
            this.price = snapshot.get("price");
            this.description = snapshot.get("description");

            if (this.imgName != snapshot.get("image")) {
                this.imgName = snapshot.get("image");
                getDownloadURL(ref(storage, this.imgName))
                    .then(url => this.imgUrl = url);
            }
        });
    }

    unmounted() {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    }

    addToCart() {
        if (auth.currentUser != null) {
            if (this.inStock >= this.quantity) {
                const productInCartRef = doc(db, "userdata", auth.currentUser.uid, "cart", this.id as string);
                updateDoc(productInCartRef, {
                    qty: increment(this.quantity)
                })
                .catch(() => {
                    setDoc(productInCartRef, {
                        qty: this.quantity
                    });
                })
                .then(() => {
                    this.quantity = 0;
                })
            }
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }
    }
}
</script>
