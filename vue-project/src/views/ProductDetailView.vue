<template>
    <h1>{{$route.params.id}}</h1>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

export default class ProductDetailView extends Vue {
    data() {
        return {
            id: -1, 
        }
    }

    
}
</script>
