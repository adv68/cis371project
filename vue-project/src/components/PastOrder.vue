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
        <p v-for="(item, pos) in names" :key="pos">{{names[pos]}}</p>

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
import { Chart, ArcElement } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

Chart.register(ArcElement);

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
    private items = [];
    private loaded = false;
    private names :Array<string> = [];
    private quantities : Array<number> = [];
    
    private chartData = {
        datasets: [{
            data: new Array<number>(),
            labels: new Array<string>(),
            backgroundColor: ["#ff0000", "#00ff00", "#0000ff"]
        }]
    }

    data() {
        return {
            chartData: this.chartData
        };
    }

    mounted() {
        getDoc(doc(db, "userdata", auth.currentUser!.uid, "orders", this.id))
            .then((ds: DocumentSnapshot) => {
                this.shipName = ds.get("shippingName");
                this.shipAddress = ds.get("shippingAddress");
                this.cardName = ds.get("cardholder");
                this.cardNum = ds.get("cardNum");
                this.items = ds.get("items");


               let data = ds.data();
               if(data != null || data != undefined){
                
                for(let i = 0; i < data.items.length; i++){
                    console.log(data.items[i].id);

                    let ref = doc(db,"products", data.items[i].id);
                    let prodDoc = getDoc(ref).then((prodshot) =>{
                        let data = prodshot.data();
                        if(data != null){
                        this.names.push(data.name + "");
                       
                        }
                        
                    }).then( () => {
                
                 let i = 0;
                    this.items.forEach((item: Item) => {
                    this.chartData.datasets[0].data.push(item.qty);
                    this.chartData.datasets[0].labels.push(this.names[i]);
                    console.log(this.names[i]);
                    i++;
                    
                });        
                
                this.loaded = true;


                    })
             

                }
             

               }
             
               
            });        
    }
}

type Item = {
    id: string,
    qty: number
}
</script>
