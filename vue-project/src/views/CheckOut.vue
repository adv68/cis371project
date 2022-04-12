<!-- This is just a placeholder for the moment -->
<template>
    <div>
        <h1>Checkout</h1>
        <h2>Shipping Information</h2>
        <div id="grid">
        
        <table>
            <td>
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
            </td>
            
        </table>

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
                    <input type="text" min ="" v-model.lazy="cardExp">

                    </td>
                </tr>
                <tr>CVV2 Number :
                    <td>
                    <input type="text" min ="" v-model.number="cardCv">
                        
                    </td>
                     </tr>
                <tr>Name on card : 
                    <td>
                    <input type="text" min ="" v-model.lazy="cardName">
                    </td>
                     </tr>
        </table>
        <button>Purchase</button>
        </div>
</template>

<style scoped>
    h2 {
        text-align: left;
    }

    h3 {
        text-align: right;
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
        table-layout:auto;
        gap: 1%;
        text-align: left;
        border:2px solid black;
        background-color: #aaaaaa;
    }

    @media screen and (min-width: 400px) {
        table, td, tr {
            table-layout: 49% 49%;
        }

        #grid {
            grid-template-columns: 49% 49%;
        }
    }

    @media screen and (min-width: 650px) {
        table, td, tr {
            table-layout: 49% 49%;
        }

        #grid {
            grid-template-columns: 32% 32% 32%;
        }
    }
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
