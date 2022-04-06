<template>
    <div v-on:click="$router.push({ name: 'productdetail', params: {id: this.id}})">
        <h2>{{name}}</h2>
        <img :id="id">
        <p>{{`$${price.toFixed(2)}`}}</p>
    </div>
</template>

<style scoped>
    div {
        background-color: #aaaaaa;
        border-radius: 15px;
    }

    div:hover {
        background-color: #888888;
    }

    img {
        width: 80%;
        margin: 0 auto;
        background-color: #bbbbbb;
        border-radius: 15px;
    }

    
</style>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";

@Options ({
    props: {
        id: String,
        name: String,
        price: Number,
        imgName: String
    }
})
export default class ProductTile extends Vue {
    id!: string;
    name!: string;
    price!: number;
    imgName!:string;

    mounted() {
        const image = document.getElementById(this.id);
        getDownloadURL(ref(storage, this.imgName))
            .then((url) => {
                image?.setAttribute("src", url);
            });
    }
}
</script>