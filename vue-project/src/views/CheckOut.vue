<!-- This is just a placeholder for the moment -->
<template>
    <div>
        <h1>Products</h1>
        <div id="grid">
            <ProductTile v-for="(product, pos) in products" :key="pos" :id="product.id" :name="product.name" :imgName="product.imgName" :price="product.price"/>
        </div>
    </div>
</template>

<style scoped>
    #grid {
        display: grid;
        grid-template-columns: 98%;
        gap: 1%;
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
