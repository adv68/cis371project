<template>
    <div id="container">
        <h2>Order {{id}}</h2>  
        <h3>Info</h3>
        <ul>
            <li>Ship To: {{shipName}}</li>
            <li>Ship To: {{shipAddress}}</li>
            <li>Bill To: {{cardName}}</li>
            <li>Bill To: {{cardNum}}</li>
        </ul>
        <h3>Items in Order</h3>
        <p v-for="(item, pos) in orderList" :key="pos">{{item}}</p>

        <Doughnut v-if="loaded" :chart-data="chartData"/>
    </div>
</template>

<style scoped>
    #container {
        width: 80%;
        max-width: 500px;
        margin: 0 auto;
        border: 1px solid #2c3e50;
        border-radius: 10px;
    }

    ul {
        text-align: left;
    }
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { db, auth } from '../firebase';
import { doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { Chart, ArcElement, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'vue-chartjs';

Chart.register(ArcElement, Legend, Tooltip);
Chart.register(ChartDataLabels);

@Options({
    components: {
        Doughnut
    },
    props: {
        id: String
    }
})
export default class PastOrder extends Vue {
    private id!: string;
    private shipName = "";
    private shipAddress = "";
    private cardName = "";
    private cardNum = "";
    private items: Array<Item> = [];
    private loaded = false;
    private orderList: Array<string> = [];
    
    private chartData = {
        labels: new Array<string>(),
        datasets: [{
            data: new Array<number>(),
            labels: new Array<string>(),
            backgroundColor: new Array<string>(),
            datalabels: {
                color: "#ffffff",
                font: {
                    size: "20pt",
                    weight: "bold"
                }
            }
        }]
    }

    data() {
        return {
            chartData: this.chartData
        };
    }

    mounted() {
        if (auth.currentUser != null) {
            getDoc(doc(db, "userdata", auth.currentUser.uid, "orders", this.id))
                .then(async (ds: DocumentSnapshot) => {
                    this.shipName = ds.get("shippingName");
                    this.shipAddress = ds.get("shippingAddress");
                    this.cardName = ds.get("cardholder");
                    this.cardNum = ds.get("cardNum");
                    this.items = ds.get("items");

                    for (const item of this.items) {
                        const ds: DocumentSnapshot = await getDoc(doc(db, "products", item.id));
                        this.orderList.push(
                            ds.get("name") + ": " + item.qty + " @ $" + ds.get("price").toFixed(2)
                        );
                        this.chartData.datasets[0].data.push(item.qty);
                        this.chartData.labels.push(ds.get("name"));
                        this.chartData.datasets[0].backgroundColor.push(`#${Math.floor(Math.random() * 255).toString(16).padStart(2, "0")}${Math.floor(Math.random() * 255).toString(16).padStart(2, "0")}${Math.floor(Math.random() * 255).toString(16).padStart(2, "0")}`)
                    }

                    this.loaded = true;
                });  
        } else {
            this.$router.push({ name: "login", query: { redirect: this.$route.path}});
        }      
    }
}

type Item = {
    id: string,
    qty: number
}
</script>
