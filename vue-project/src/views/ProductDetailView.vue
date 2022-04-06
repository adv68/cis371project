<template>
    <h1>{{name}}</h1>
    <img :src="imgUrl">
    <h2>{{`$${price.toFixed(2)}`}}</h2>
    <p>{{description}}</p>
</template>

<style scoped>
    img {
        width: 40%;
        border-radius: 20px;
    }
</style>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { doc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

export default class ProductDetailView extends Vue {
    private id: string | string[] | null = null;
    private name = "";
    private imgName = "";
    private imgUrl = "";
    private price = 0;
    private description = "";
    
    mounted() {
        this.id = this.$route.params.id;
        getDoc(doc(db, "products", this.id as string))
            .then((product: DocumentSnapshot) => {
                const data = product.data();
                this.name = data?.name;
                this.imgName = data?.image;
                this.price = data?.price;
                this.description = data?.description;
            })
            .then(() => {
                getDownloadURL(ref(storage, this.imgName))
                    .then((url) => this.imgUrl = url);
            });
    }
}
</script>
