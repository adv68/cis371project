<template>
    <span>
    <h1>{{name}}</h1>
    <img :src="imgUrl">
    <h2>{{`$${price.toFixed(2)}`}}</h2>
    <p>{{description}}</p>

    <input type="number" v-model="quantity"/>
    <button id="addToCart" @click="addToCart"  v-bind:disabled="disabled">Add to cart</button>
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
import { doc, getDoc, DocumentSnapshot, collection, addDoc, increment, updateDoc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";

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
    private disabled = false;
    
    mounted() {
        this.id = this.$route.params.id;
        getDoc(doc(db, "products", this.id as string))
            .then((product: DocumentSnapshot) => {
                const data = product.data();
                this.name = data?.name;
                this.imgName = data?.image;
                this.price = data?.price;
                this.description = data?.description;
                this.inStock = data?.inStock;
            
            })
            .then(() => {
                if(this.inStock == 0){
                    
                    this.message = "Out of Stock";
                    this.disabled = true;
                }
                getDownloadURL(ref(storage, this.imgName))
                    .then((url) => this.imgUrl = url);
            });    
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
    
    carted() : void {
        try{
            this.message ="";
            let uid = auth.currentUser?.uid;
            if(uid == undefined){
                throw console.error();
                
            }

            if(this.inStock >= this.quantity){
                const collectionRef = collection(db, "userdata", uid + "", "cart" );        
                addDoc(collectionRef, {productName : this.name,price : this.price, quantity : this.quantity})
            
            }else{
                this.message = "Quantity to Large. Try a smaller number";
            }
        }catch{
            console.log("user not logged in");
            this.message = " User not logged in. Log in or create an account to continue";
        }
    }
}
</script>
