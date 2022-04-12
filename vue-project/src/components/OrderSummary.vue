<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options ({
    OrderSummary: {
        name: String,
        address: String,
        city: String,
        zip: String
    }
})
export default class OrderSummary extends Vue {
    OrderSummary = {
    name: "",
    address: "",
    city: "",
    zip: "",
    };
}
</script>