<template>
    <div>
        <h1>Products</h1>
        <div id="grid">
            <ProductTile v-for="(product, pos) in products" :key="pos" :name="product.name" :imgName="product.imgName" :description="product.description"/>
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

@Options({
  components: {
    ProductTile,
  },
})

export default class ListProductsView extends Vue {
    // TEMPORARY
    // temp data until we integrate with firebase
    private products: Array<Product> = [
        {
            name: "Product 1",
            imgName: "logo.png",
            description: "Description for Product 1"
        },  
        {
            name: "Product 2",
            imgName: "logo.png",
            description: "Description for Product 2"
        },  
        {
            name: "Product 3",
            imgName: "logo.png",
            description: "Description for Product 3"
        },  
        {
            name: "Product 4",
            imgName: "logo.png",
            description: "Description for Product 4"
        },  
        {
            name: "Product 5",
            imgName: "logo.png",
            description: "Description for Product 5"
        }
    ];


}

type Product = {
    name: string;
    imgName: string;
    description: string;
}

</script>
