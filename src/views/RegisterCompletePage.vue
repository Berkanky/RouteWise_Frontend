<template>
    <ion-page class="signup-page">
        <ion-content fullscreen>
            <!-- Logo -->
            <div class="logo-wrapper">
                <img src="../Images/RouteWise-3D-İcon.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">Register</h1>
            <p class="subtitle">
                Please fill in the necessary information to complete the registration process.
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Email Address</ion-label> -->
                    <ion-input class="custom-input" v-model="this.store.RegisterData.EMailAddress" type="email"
                        placeholder="username@example.com" required disabled></ion-input>
                </ion-item>

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Password</ion-label> -->
                    <ion-input :disabled="this.IsRegisterCompleted" class="custom-input"
                        v-model="this.store.RegisterData.Password" type="password" placeholder="Password." minlength="6"
                        required>
                        <ion-input-password-toggle color="danger" slot="end"></ion-input-password-toggle>
                    </ion-input>
                </ion-item>

                <RequirementContainerVue
                    Type="RegisterComplete"
                    RequirementType="Password"
                    :IsValid="this.store.PasswordRegex(this.store.RegisterData.Password)"
                />

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Confirm Password</ion-label> -->
                    <ion-input :disabled="this.IsRegisterCompleted" class="custom-input"
                        v-model="this.store.RegisterData.PasswordConfirm" type="password"
                        placeholder="Password Confirm." minlength="6" required>
                        <ion-input-password-toggle color="danger" slot="end"></ion-input-password-toggle>
                    </ion-input>
                </ion-item>

                <RequirementContainerVue
                    Type="RegisterComplete"
                    RequirementType="PasswordConfirm"
                    :IsValid="this.store.PasswordRegex(this.store.RegisterData.PasswordConfirm)"
                />

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Name</ion-label> -->
                    <ion-input class="custom-input" :disabled="this.IsRegisterCompleted"
                        v-model="this.store.RegisterData.Name" type="text" placeholder="First Name" minlength="6"
                        required></ion-input>
                </ion-item>

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Surname</ion-label> -->
                    <ion-input class="custom-input" :disabled="this.IsRegisterCompleted"
                        v-model="this.store.RegisterData.Surname" type="text" placeholder="Last Name" minlength="6"
                        required></ion-input>
                </ion-item>

                <ion-button v-if="!this.IsRegisterCompleted" v-on:click="this.CompleteRegister()" type="submit"
                    expand="block" :class="this.isValid() ? 'continue-button' : 'continue-button-disabled'"
                    :disabled="!this.isValid()">
                    complete
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import RequirementContainerVue from '@/components/RequirementContainer.vue';

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
        RequirementContainerVue
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
        }
    },
    created() {
        this.store.OnboardingStep = 3;
    },
    methods: {
        IsPasswordConfirmRegex() {
            var PasswordConfirm = this.store.RegisterData?.PasswordConfirm;
            var isPasswordConfirmRegex = this.store.PasswordRegex(PasswordConfirm);
            console.log("Password Confirm Regex : ", isPasswordConfirmRegex);
            return isPasswordConfirmRegex
        },
        IsPasswordValid() {
            var Password = this.store.RegisterData.Password;
            var PasswordConfirm = this.store.RegisterData.PasswordConfirm;

            return Password === PasswordConfirm && this.store.PasswordRegex(Password) && this.store.PasswordRegex(PasswordConfirm) ? true : false;
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
.input-container {
    --background: #ffffff;
    --border-radius: 25px;
    --border-color: #e0e0e0;
    --border-width: 1px;
    --padding-start: 15px;
    --padding-end: 15px;
    margin-bottom: 15px;
    width: 100%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    --border-style: solid;
}

.custom-input {
    --placeholder-color: #999;
    --placeholder-opacity: 1;
}

.PasswordWarningCard {
    --border-width: 0 !important;
    --box-shadow: none !important;
    border: none !important;
    box-shadow: none !important;
}

.PasswordClass {
    border-radius: 30px;
    border: 1px solid #F00;
}

.signup-page {
    --background: #ffffff;
}

.logo-wrapper {
    text-align: center;
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

.continue-button {
    --background: #e4002b;
    --border-radius: 24px;
    color: #fff;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    text-transform: none;
}

.continue-button-disabled {
    --background: var(--Deselect, #D1D1D1);
    --border-radius: 24px;
    color: Gray;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    text-transform: none;
}
</style>