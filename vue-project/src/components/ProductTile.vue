<template>
    <div v-on:click="nothing">
        <h2>{{name}}</h2>
        <img :src="require(`../assets/${imgName}`)">
        <p>{{description}}</p>
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

@Options ({
    props: {
        name: String,
        description: String,
        imgName: String
    }
})
export default class ProductTile extends Vue {
    name!: string;
    description!: string;
    imgName!:string;
}

</script>