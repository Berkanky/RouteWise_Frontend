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
                Kayıt olmak için gerekli bilgileri giriniz.
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">
                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Email Address</ion-label>
                    <ion-input v-model="this.store.RegisterData.EMailAddress" type="email"
                        placeholder="username@example.com" required disabled></ion-input>
                </ion-item>

                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Password</ion-label>
                    <ion-input v-model="this.store.RegisterData.Password" type="password"
                        placeholder="min. 6 characters" minlength="6" required disabled></ion-input>
                </ion-item>

                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Name</ion-label>
                    <ion-input v-model="this.store.RegisterData.Name" type="text" placeholder="First name" minlength="6"
                        required></ion-input>
                </ion-item>

                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Surname</ion-label>
                    <ion-input v-model="this.store.RegisterData.Surname" type="text" placeholder="Last name"
                        minlength="6" required></ion-input>
                </ion-item>

                <ion-button 
                    v-if="!this.IsRegisterCompleted"
                    v-on:click="this.CompleteRegister()" type="submit" expand="block"
                    :disabled="!this.isValid()" class="continue-button">
                    Complete
                </ion-button>
                <ion-button 
                    v-else-if="this.IsRegisterCompleted"
                    v-on:click="this.goLoginPage()" type="submit" expand="block"
                    class="continue-button">
                    Login Page
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import { UseStore } from '../stores/store';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import axios from 'axios';
export default {
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonButton
    },
    setup() {
        const store = UseStore();
        return {
            store
        }
    },
    data: function () {
        return {
            IsRegisterCompleted:false
        }
    },
    methods: {
        goLoginPage(){
            this.store.LoginData.EMailAddress = this.store.RegisterData.EMailAddress;
            this.store.LoginData.Password = this.store.RegisterData.Password;
            this.$router.push({path: '/login'});
        },
        async CompleteRegister() {
            var ServerRoot = this.store.ServerRoot;
            var EMailAddress = this.store.RegisterData.EMailAddress;
            axios.post(`${ServerRoot}/register/complete/${EMailAddress}`, { RegisterData: this.store.RegisterData })
                .then(res => {
                    console.log(res);
                    if(res.status === 200) this.IsRegisterCompleted = true;
                })
                .catch(err => {
                    console.log(err);
                    if (err.status === 504) return this.CompleteRegister();
                })

        },
        isValid() {
            var Name = this.store.RegisterData.Name;
            var Surname = this.store.RegisterData.Surname;

            return !Name || !Surname ? false : true;
        },
    }
}
</script>

<style scoped>
.inputLabels {
    font-weight: bold;
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
    margin-bottom: 16px;
    --background: transparent;
}

ion-input {
    --padding-start: 12px;
    --padding-end: 12px;
    --border-radius: 8px;
}

.continue-button {
    --background: #e4002b;
    --border-radius: 24px;
    color: #fff;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
}
</style>