<template>
    <div>
        <h1>Checkout</h1>
        <h2>Shipping Information</h2>
        <div id="grid">
        
        <table>
            <td>
<<<<<<< HEAD
                <tr>Name : <td> 
                    <input type="text" min ="" v-model.lazy="custName"> </td> 
                    
                    </tr>
                <tr>Street Address : <td> 
                    <input type="text" min ="" v-model.lazy="custAddress"> 
                    </td>
                    </tr>
                <tr>City : 
                    <td>
                        <input type="text" min ="" v-model.lazy="custCity"> 
                        </td> 
                </tr>
                <tr>Zipcode :
                    <td>
                        <input type="text" min ="" v-model.lazy="custZip">
                    </td>
                     </tr>
=======
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
>>>>>>> 1727a2af688f44829f2d739353be2060f7cc17c1
            </td>
        </table>
<<<<<<< HEAD

        <table>
        <th>Product</th>
        <th>Price</th>
        <th>Quantity</th>
        <tr v-for="(item, pos) in items" :key="pos">
            <td>{{items[pos].name}}</td>
            <td>{{items[pos].price}} </td>
            <td>{{items[pos].quantity}} </td>
        </tr>        
        <tr>Total :
        <td> ${{this.total}} </td>    
        </tr>
        </table>
        
        </div>
        <h2>Payment Information</h2>
        <table>
            
                <tr>Credit Card number :
                    <td>
                    <input type="text" min ="" v-model.number="cardNum">
                    </td>
                         </tr>
                <tr>Expiration Date : 
                    <td>
=======
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
>>>>>>> 1727a2af688f44829f2d739353be2060f7cc17c1
                    <input type="text" min ="" v-model.lazy="cardExp">

                    </td>
                </tr>
<<<<<<< HEAD
                <tr>CVV2 Number :
                    <td>
                    <input type="text" min ="" v-model.number="cardCv">
                        
                    </td>
                     </tr>
                <tr>Name on card : 
                    <td>
=======
                <tr>
                    <input type="text" min ="" v-model.lazy="cardCVV">
                </tr>
                <tr>
>>>>>>> 1727a2af688f44829f2d739353be2060f7cc17c1
                    <input type="text" min ="" v-model.lazy="cardName">
                    </td>
                     </tr>
        </table>
<<<<<<< HEAD
        <button>Purchase</button>
=======
        <button @click="save()">Submit</button>
>>>>>>> 1727a2af688f44829f2d739353be2060f7cc17c1
        </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { collection, getDocs, QuerySnapshot, QueryDocumentSnapshot, addDoc, deleteDoc, doc} from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

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
                this.total +=qd.data().price;
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
<<<<<<< HEAD
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProductTile from '../components/ProductTile.vue';
import { collection, getDocs, QuerySnapshot, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { onMounted } from '@vue/runtime-core';
/* @Options({
  components: {
    ProductTile,
  },
}) */

type Item = {
        price: 0;
        name: 0;
        quantity :0;
    }

    

export default class CheckoutView extends Vue {
    private prices: Array<number> = [];
    public total = 0;

    
    private items : Array<Item> = [];
    
    mounted() {
        let uid = null;
        const auth = getAuth();
        if(auth.currentUser != null){
            uid= auth.currentUser.uid;
        }
        //const productCollection = collection(db, "products");
        const collectionRef = collection(db, "Users", uid + "", "Cart" );
        getDocs(collectionRef).then((qs:QuerySnapshot) => {
            qs.forEach((qd: QueryDocumentSnapshot) => {
                this.total +=qd.data().price * qd.data().quantity;
                console.log(qd.data().price)

                let item : Item ={
                    name : qd.data().productName,
                    price : qd.data().price,
                    quantity : qd.data().quantity
                }

                this.items.push(item);
                })
            })
            .catch((error) => {
                console.log(error);
            });
        console.log("after prices load");
    }
}
</script>
=======
</style>
>>>>>>> 1727a2af688f44829f2d739353be2060f7cc17c1
