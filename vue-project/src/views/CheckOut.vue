<template>
    <div>
        <h1>Checkout</h1>
        <h2>Shipping Information</h2>
        <div id="grid">
        
        <table>
            <td>
                <tr>Name : </tr>
                <tr>Street Address : </tr>
                <tr>City : </tr>
                <tr>Zipcode : </tr>
            </td>
            <td>
                <tr><input type="text" min = "" v-model.lazy="custName"/></tr>
                <tr><input type="text" v-model.lazy="custAddress"/></tr>
                <tr><input type="text" v-model.lazy="custCity"/></tr>
                <tr><input type="text" v-model.lazy="custZip"/></tr>
            </td>
        </table>

        <table>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <tr v-for="(item,pos) in items" :key =pos> 
                <td>{{item.name}}</td>
                <td>{{item.quantity}}</td>
                <td>{{item.price}}</td>

            
            
            </tr>

        </table>
        <h3>    Total : ${{this.total}}</h3>
        </div>
        <h2>Payment Information</h2>
        <table>
            <td>
                <tr>Credit Card number : </tr>
                <tr>Expiration Date : </tr>
                <tr>CVV2 Number : </tr>
                <tr>Name on card : </tr>
            </td>
            <td>
                <tr>
                    <input type="text" min ="" v-model.lazy="cardNum">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="cardExp">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="cardCVV">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="cardName">
                </tr>
            </td>
        </table>
        <button @click="save()">Submit</button>
        </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { collection, getDocs, QuerySnapshot, QueryDocumentSnapshot, addDoc, deleteDoc, doc} from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

type Item = {
    name: "",
    price:0,
    quantity:0

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
    cardCVV = "";
    cardName = "";
    uid = "";
    private items : Array<Item> = [];
    save():void{  
        const orderRef = collection(db, "Users", this.uid + "", "Orders");
        const cartRef = collection(db, "Users", this.uid + "", "Cart" );
        addDoc(orderRef, {name: this.custName, address: this.custAddress,
        city: this.custCity, zip: this.custZip, cardNumber: this.cardNum,
        cardExpiration: this.cardExp, cardCVV2: this.cardCVV, NameOnCard: this.cardName});
        getDocs(cartRef).then((qs:QuerySnapshot) => {
            qs.forEach((qd: QueryDocumentSnapshot) => {
                deleteDoc(doc(db, "Users", this.uid + "", "Cart", "" + qd.id));
                
            
            })
        })
            .catch((error) => {
                console.log(error);
            });
            this.$router.replace("/about");
    }
    mounted() {
        const auth = getAuth();
        if(auth.currentUser != null){
            this.uid= auth.currentUser.uid;
        }
        //const productCollection = collection(db, "products");
        const collectionRef = collection(db, "Users", this.uid + "", "Cart" );
        getDocs(collectionRef).then((qs:QuerySnapshot) => {
                
            qs.forEach((qd: QueryDocumentSnapshot) => {
                this.total +=qd.data().price * qd.data().quantity;

                this.items.push({name:qd.data().productName, price: qd.data().price, quantity: qd.data().quantity});
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
</script>

<style scoped>
    h2 {
        text-align: left;
    }
    #grid {
        display: grid;
        grid-template-columns: 98%;
        gap: 1%;
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
            grid-template-columns: 49% 49%;
        }
    }
    @media screen and (min-width: 650px) {
        #grid {
            grid-template-columns: 32% 32% 32%;
        }
    }
</style>