<template>
    <div>
        <h1>Login</h1>
        <label for="email">Email</label>
        <input name="email" v-model="emailLogin">
        <br>
        <label for="password">Password</label>
        <input type="password" name="password" v-model="emailLoginPassword">
        <br>
        <button @click="credentialLogin" :disabled="emailLogin.length === 0 || emailLoginPassword.length === 0">Sign In</button>
        <hr>
        <button @click="googleLogin">Sign in with Google</button>
        <hr>
        <h1>Sign Up</h1>
        <label for="signupemail">Email Address</label>
        <input name="signupemail" v-model="emailSignup">
        <br>
        <label for="signuppassword">Password</label>
        <input type="password" name="signuppassword" v-model="emailSignupPassword">
        <br>
        <label for="signuppassword2">Confirm Password</label>
        <input type="password" name="signuppassword2" v-model="emailSignupPassword2" 
            :class="emailSignupPassword !== emailSignupPassword2  ? 'error' : ''">
        <br>
        <button @click="credentialRegister" :disabled="emailSignup.length === 0 || emailSignupPassword.length === 0 ||
            emailSignupPassword2.length === 0 || emailSignupPassword !== emailSignupPassword2">Register</button>
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

    .error {
        border-color: #ff0000;
    }
</style>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut, UserCredential } from "firebase/auth";
// eslint-disable-next-line
import { Router } from "vue-router"; // this import is not used but is required as allows the routing functions
import { auth } from "../firebase"

export default class LoginView extends Vue {
    data() {
        return {
            nextPage: null
        }
    }

    private emailLogin = "";
    private emailLoginPassword = "";

    private emailSignup = "";
    private emailSignupPassword = "";
    private emailSignupPassword2 = "";

    credentialLogin() {
        signInWithEmailAndPassword(auth, this.emailLogin, this.emailLoginPassword)
            .then(async (user: UserCredential) => {
                if (user.user.emailVerified) {
                    if (this.$route.query["redirect"] != null) {
                        this.$router.replace({path: this.$route.query["redirect"] as string});
                    } else {
                        this.$router.replace({name: "home"});
                    }

                    //this.$router.push({name: 'home'});
                } else {
                    alert("Your email address is not verified.");
                    await signOut(auth);
                    this.clearTextBoxes();
                }
            })
            .catch((error) => {
                alert(`There was an error signing in.\n${error}`)
                this.clearTextBoxes();
            })
    }

    googleLogin() {
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .then(() => {
                if (this.$route.query["redirect"] != null) {
                    this.$router.replace({path: this.$route.query["redirect"] as string});
                } else {
                    this.$router.replace({name: "home"});
                }
            });
    }

    credentialRegister() {
        createUserWithEmailAndPassword(auth, this.emailSignup, this.emailSignupPassword)
            .then(async (user: UserCredential) => {
                alert("Press OK to send verification email.");
                await sendEmailVerification(user.user);
                await signOut(auth);
                this.clearTextBoxes();
            })
    }

    clearTextBoxes() {
        this.emailLogin = "";
        this.emailLoginPassword = "";

        this.emailSignup = "";
        this.emailSignupPassword = "";
        this.emailSignupPassword2 = "";
    }
}
</script>