<template>
    <h1>You have been logged out.</h1>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Auth, getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, UserCredential, getRedirectResult } from "firebase/auth";
import { Router } from "vue-router";

export default class LoginView extends Vue {
    private auth: Auth | null = null;

    data() {
        return {
            nextPage: null
        }
    }

    mounted() {
        this.auth = getAuth();
        this.auth.signOut()
            .then(() => {
                this.$router.replace({ name: "home"});
            });
    }
}
</script>