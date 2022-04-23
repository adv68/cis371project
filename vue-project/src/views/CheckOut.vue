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

                <p v-for="(item, pos) in items" :key="pos">({{item.quantity}}) {{item.name}} - ${{(item.price * item.quantity).toFixed(2)}}</p>

                <h3>Total: ${{total.toFixed(2)}}</h3>
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
import { collection, getDocs, QuerySnapshot, QueryDocumentSnapshot, addDoc, deleteDoc, doc, updateDoc, getDoc} from 'firebase/firestore';
import { db, auth } from '../firebase';

type Item = {
    name: string,
    price: 0,
    quantity: 0,
    id: string
}

export default class CheckoutView extends Vue {
    private prices: Array<number> = [];
    private products = {};
    private total = 0;
    custName = "";
    custAddress = "";
    custCity = "";
    custZip = "";
    cardNum = "";
    cardExp = "";
    cardCVC = "";
    cardName = "";
    private items : Array<Item> = [];
    private ids : Array<string> = [];
    private quantities :Array<number> = []; 

    mounted() {
        
        if (auth.currentUser != null) {
            
            const userCartItems = collection(db, "userdata", auth.currentUser.uid, "cart");
            getDocs(userCartItems)
                .then((qs_cart: QuerySnapshot) => {
                    const products = collection(db, "products");
                    getDocs(products)
                        .then((qs_prod: QuerySnapshot) => {
                            qs_cart.docs.forEach((ds: QueryDocumentSnapshot) => {
                                const itemData = ds.data();
                                const itemProductData = qs_prod.docs.find((d) => d.id == ds.id)!.data();
                               this.ids.push(ds.id);
                                if (itemData != null) {
                                    this.items.push({
                                        price: itemProductData.price,
                                        quantity: itemData.qty,
                                        name: itemProductData.name,
                                        id: ds.id
                                    });
                                    this.quantities.push(itemData.qty)
                                    this.total += (itemProductData.price * itemData.qty);
                                    console.log("ids length " + this.ids.length );
                                }
                            })
                        })
                })
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }
    }

    submit() {
        if (auth.currentUser != null) {
            console.log(this.ids.length);
             for(let i = 0; i < this.ids.length; i++){
                let ref = doc(db,"products", this.ids[i]);
                let prodDoc = getDoc(ref).then((prodShot) => {
                    let data = prodShot.data();
                    if(data != null){
                    let stock = data.inStock; 
                    let newStock = stock - this.quantities[i];
                    updateDoc(ref,{inStock: newStock});
                    console.log(newStock)
                    }else{
                        console.log("data null");
                    }
                    console.log(this.ids[i] + " id");
                });        
               
            }

            addDoc(collection(db, "userdata", auth.currentUser.uid, "orders"), {
                shippingName: this.custName,
                shippingAddress: `${this.custAddress} ${this.custCity} ${this.custZip}`,
                cardNum: `************${this.cardNum.substring(12)}`,
                cardholder: this.cardName,
                items: this.items.map((item: Item) => ({id: item.id, qty: item.quantity}))
            }).then(() => {
                getDocs(collection(db, "userdata", auth.currentUser!.uid, "cart"))
                    .then((qs: QuerySnapshot) => {
                        qs.forEach((qds: QueryDocumentSnapshot) => {
                            deleteDoc(qds.ref);
                        });
                    });
                
            });
           
           

            //this.$router.push({ name: "home"});
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }
    }
}
</script>
