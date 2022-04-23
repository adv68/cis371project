<template>
    <div>
        <h1>Order History</h1>
        <PastOrder v-for="(id, pos) in orderIds" :key="pos" :id="id" />
        <h2 v-if="orderIds.length == 0">You have no past orders</h2>
    </div>
</template>

<script lang="ts">
import { collection, getDocs, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { Options, Vue } from 'vue-class-component';
import PastOrder from '../components/PastOrder.vue'
import { auth, db } from '../firebase';

@Options({
    components: {
        PastOrder
    }
})
export default class OrderHistory extends Vue {
    private orderIds: Array<string> = [];

    mounted() {

        if (auth.currentUser != null) {
    
            getDocs(collection(db, "userdata", auth.currentUser.uid, "orders"))
                .then((qs: QuerySnapshot) => {
                    qs.forEach((qds: QueryDocumentSnapshot) => {
                        this.orderIds.push(qds.id);
                    })
                })
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }
    }
}
</script>