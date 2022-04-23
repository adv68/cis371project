<template>
    <div v-if="!deleted">
        <p v-if="qty > numInStock" class="warn">**Your order quantity has been reduced due to lack of stock.**</p>
        <h2>{{name}}</h2>
        <h3 id="totalPrice">${{((qty > numInStock ? numInStock : qty) * costPerItem).toFixed(2)}}</h3>
        <h3>QTY: {{qty > numInStock ? numInStock : qty}}</h3>
        <p>Product_ID: {{id}}</p>
        <button @click="removeItemFromCart">Remove Item</button>
    </div>
</template>

<style scoped>
    div {
        text-align: left;
        border: 1px solid #2c3e50;
        border-radius: 10px;
        padding: 5px;
    }

    #totalPrice {
        float: right;
    }

    button, .warn {
        color: #ff0000;
    }
</style>

<script lang="ts">
import { deleteDoc, doc } from 'firebase/firestore';
import { Options, Vue } from 'vue-class-component';
import { db, auth } from '../firebase';


@Options({
    props: {
        name: String,
        qty: Number,
        costPerItem: Number,
        id: String,
        numInStock: Number
    }
})
export default class CartProduct extends Vue {
    name!: string;
    qty!: number;
    costPerItem!: number;
    id!: string;
    numInStock!: number;

    deleted = false;

    removeItemFromCart() {
        if (auth.currentUser != null) {
            deleteDoc(doc(db, "userdata", auth.currentUser.uid, "cart", this.id));
            this.deleted = true;
        }
    }
}

</script>