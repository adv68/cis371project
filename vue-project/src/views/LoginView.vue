<template>
    <div>
        <h1>Login</h1>
        <label for="email">Email</label>
        <input name="email">
        <br>
        <label for="password">Password</label>
        <input type="password" name="password">
        <br>
        <button>Sign In</button>
        <hr>
        <button @click="googleLogin">Sign in with Google</button>
        <hr>
        <h1>Sign Up</h1>
        <label for="signupemail">Email Address</label>
        <input name="signupemail">
        <br>
        <label for="signuppassword">Password</label>
        <input type="password" name="signuppassword">
        <br>
        <label for="signuppassword2">Confirm Password</label>
        <input type="password" name="signuppassword2">
        <br>
        <button>Register</button>
    </div>
</template>

<style scoped>
    div {
        width: 80%;
        max-width: 300px;
        margin: 0 auto;
        border: 3px solid #2c3e50;
        border-radius: 5px;
    }

    label, input {
        padding: 3px;
        margin: 3px;
    }

    button {
        padding: 5px 20px;
        margin: 3px;
    }
</style>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
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
    }

    //credentialLogin() {}

    googleLogin() {
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(this.auth!, googleProvider)
            .then((cred: UserCredential) => {
                this.$router.push({ name: 'home'});
            });
    }

    //credentialRegister() {}
}
</script>