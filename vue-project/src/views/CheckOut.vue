<!-- This is just a placeholder for the moment -->
<template>
    <div>
        <h1>Checkout</h1>
        <h2 id="header">Shipping Information</h2>
        <div id="table">
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
        </div>
        <h2 id="header">Payment Information</h2>
        <div id="table">
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
        </div>
    </div>
</template>

<style scoped>
    #header {
        text-align: left;
    }

    #table {
        margin-top: 8px;
        margin-right: 8px;
        display: table;
        table-layout:auto;
        gap: 1%;
        text-align: left;
        border-width:thick;
        border-color: blueviolet;
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

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProductTile from '../components/ProductTile.vue';
import { collection, getDocs, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

@Options({
  components: {
    ProductTile,
  },
})

export default class ListProductsView extends Vue {
    private products: Array<Product> = [];

    mounted() {
        const productCollection = collection(db, "products");
        getDocs(productCollection)
            .then((qs: QuerySnapshot) => {
                qs.docs.forEach((ds: DocumentSnapshot) => {
                    const data = ds.data();
                    if (data != null) {
                        this.products.push({
                            id: ds.id,
                            name: data.name,
                            imgName: data.image,
                            price: data.price
                        }); 
                    }
                })
            })
            .catch((error) => {
                console.log(error);
            });     
    }
}

type Product = {
    id: string;
    name: string;
    imgName: string;
    price: number;
}

</script>
