<template>
    <ion-page class="signup-page">
        <ion-content fullscreen>
            <!-- Logo -->
            <div class="logo-wrapper">
                <img src="../Images/Vector.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">Register</h1>
            <p class="subtitle">
                Please fill in the necessary information to complete the registration process.
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">

                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Email Address</ion-label>
                    <ion-input v-model="this.store.RegisterData.EMailAddress" type="email"
                        placeholder="username@example.com" required disabled></ion-input>
                </ion-item>

                <ion-item 
                    class="input-item"
                    lines="none">
                    <ion-label position="stacked" class="inputLabels">Password</ion-label>
                    <ion-input 
                        :disabled="this.IsRegisterCompleted"
                        :class="this.IsPasswordValid() && this.IsPasswordRegex() ? 'input-item' : 'PasswordClass'" 
                        v-model="this.store.RegisterData.Password" :type="this.IsPwd ? 'password' : 'text'"
                        placeholder="Password." minlength="6" required>
                        <ion-input-password-toggle color="danger" slot="end" v-on:click="this.IsPwd =! this.IsPwd"></ion-input-password-toggle>
                    </ion-input>
                </ion-item>

                <ion-item 
                    class="input-item"
                    lines="none">
                    <ion-label position="stacked" class="inputLabels">Confirm Password</ion-label>
                    <ion-input 
                        :disabled="this.IsRegisterCompleted"
                        :class="this.IsPasswordValid() && this.IsPasswordConfirmRegex()  ? 'input-item' : 'PasswordClass'" 
                        v-model="this.store.RegisterData.PasswordConfirm" :type="this.IsPwd ? 'password' : 'text'"
                        placeholder="Password." minlength="6" required>
                        <ion-input-password-toggle color="danger" slot="end" v-on:click="this.IsPwd =! this.IsPwd"></ion-input-password-toggle>
                    </ion-input>
                </ion-item> 

                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Name</ion-label>
                    <ion-input 
                        :disabled="this.IsRegisterCompleted"
                        v-model="this.store.RegisterData.Name" type="text" placeholder="Name" minlength="6"
                        required></ion-input>
                </ion-item>

                <ion-item class="input-item" lines="none" >
                    <ion-label position="stacked" class="inputLabels">Surname</ion-label>
                    <ion-input 
                        :disabled="this.IsRegisterCompleted"
                        v-model="this.store.RegisterData.Surname" type="text" placeholder="Surname"
                        minlength="6" required></ion-input>
                </ion-item>

                <ion-button 
                    v-if="!this.IsRegisterCompleted" v-on:click="this.CompleteRegister()" type="submit"
                    expand="block" 
                    :class="this.isValid() ? 'continue-button' : 'continue-button-disabled'"
                    :disabled="!this.isValid()" 
                    >
                     complete
                </ion-button>
                <!-- <ion-button v-else-if="this.IsRegisterCompleted" v-on:click="this.goLoginPage()" type="submit"
                    expand="block" class="continue-button">
                    Login Page
                </ion-button> -->
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import { UseStore } from '../stores/store';
import { 
    IonPage, 
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonInputPasswordToggle
} from '@ionic/vue';
import axios from 'axios';
export default {
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonButton,
        IonInputPasswordToggle,
    },
    setup() {
        const store = UseStore();
        return {
            store
        }
    },
    data: function () {
        return {
            IsRegisterCompleted: false,
            IsPwd:false
        }
    },
    created(){
        this.store.OnboardingStep = 3;
    },
    methods: {
        IsPasswordConfirmRegex(){
            var PasswordConfirm = this.store.RegisterData?.PasswordConfirm;
            var isPasswordConfirmRegex = this.store.PasswordRegex(PasswordConfirm);
            console.log("Password Confirm Regex : ", isPasswordConfirmRegex);
            return isPasswordConfirmRegex
        },
        IsPasswordRegex(){
            var Password = this.store.RegisterData?.Password;
            var isPasswordRegex = this.store.PasswordRegex(Password);
            console.log("Password Regex : ", isPasswordRegex);
            return isPasswordRegex
        },
        IsPasswordValid() {
            return this.store.RegisterData?.Password === this.store.RegisterData?.PasswordConfirm ? true : false;
        },
        goLoginPage() {
            this.store.LoginData.EMailAddress = this.store.RegisterData.EMailAddress;
            this.store.LoginData.Password = this.store.RegisterData.Password;
            this.$router.push({ path: '/login' });
        },
        async CompleteRegister() {
            var ServerRoot = this.store.ServerRoot;
            var EMailAddress = this.store.RegisterData.EMailAddress;
            axios.post(`${ServerRoot}/register/complete/${EMailAddress}`, { RegisterData: this.store.RegisterData })
                .then(res => {
                    console.log(res);
                    if (res.status === 200) this.IsRegisterCompleted = true, this.goLoginPage();
                })
                .catch(err => {
                    console.log(err);
                    if (err.status === 504) return this.CompleteRegister();
                })

        },
        isValid() {
            var Name = this.store.RegisterData.Name;
            var Surname = this.store.RegisterData.Surname;

            if (Name && Surname && this.IsPasswordValid()) return true
            return false
        },
    }
}
</script>

<style scoped>

.PasswordWarningCard{
    --border-width: 0 !important;
    --box-shadow: none !important;
    border: none !important;
    box-shadow: none !important;
}

.PasswordClass{
    border-radius: 30px;
    border: 1px solid #F00;
}

.inputLabels {
    font-weight: bold;
    margin-bottom:9px;
    margin-left:3px;
}

.signup-page {
    --background: #ffffff;
}

.logo-wrapper {
    text-align: center;
    margin-top: 60px;
}

.logo {
    width: 80px;
    height: auto;
}

.title {
    text-align: center;
    margin: 24px 16px 8px;
    font-size: 24px;
    font-weight: 600;
    color: #000;
}

.subtitle {
    text-align: center;
    margin: 0 32px 24px;
    font-size: 14px;
    color: #666;
}

.form {
    padding: 0 16px;
}

.input-item {
    margin-bottom: 10px;
    --background: transparent;
}

ion-input {
    --padding-start: 12px;
    --padding-end: 12px;
    border-radius: 30px;
    border: 1px solid var(--dark---30, #E5E5E5);
}

ion-button{
    padding-inline:12px;
}

.continue-button {
    --background: #e4002b;
    --border-radius: 24px;
    color: #fff;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    text-transform: capitalize;
}

.continue-button-disabled {
    --background: var(--Deselect, #D1D1D1);
    --border-radius: 24px;
    color:Gray;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    text-transform: capitalize;
}
</style>