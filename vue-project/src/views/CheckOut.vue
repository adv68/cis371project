<!-- This is just a placeholder for the moment -->
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
                <tr>
                    <input type="text" min ="" v-model.lazy="custName">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="custAddress">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="custCity">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="custZip">
                </tr>
            </td>
            
        </table>
        <h3>Total : ${{this.total}}</h3>
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
                    <input type="text" min ="" v-model.number="cardNum">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="cardExp">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.number="cardCv">
                </tr>
                <tr>
                    <input type="text" min ="" v-model.lazy="cardName">
                </tr>
            </td>
        </table>
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

export default class CheckoutView extends Vue {
    private prices: Array<number> = [];
    public total = 0;

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
                this.total +=qd.data().price;
                console.log(qd.data().price)
                })
            })
            .catch((error) => {
                console.log(error);
            });
        console.log("after prices load");
    }
}
</script>
