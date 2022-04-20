<template>
    <h1>You have been logged out.</h1>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { auth } from "../firebase";
// eslint-disable-next-line
import { Router } from "vue-router"; // this import is not used but is required as allows the routing functions

export default class LoginView extends Vue {
    data() {
        return {
            nextPage: null
        }
    }

    mounted() {
        auth.signOut()
            .then(() => {
                this.$router.replace({ name: "home"});
            });
    }
}
</script>