<template>
    <h1>Login</h1>
    <label for="username">Username</label>
    <input name="username">
    <br>
    <label for="password">Password</label>
    <input type="password" name="password">
    <br>
    <button>Sign In</button>
</template>

<style scoped>
    label, input {
        padding: 3px;
        margin: 3px;
    }

    button {
        padding: 5px 20px;
        margin: 3px;
    }
</style>