<template>
    <ion-page class="signup-page">
        <ion-content fullscreen>
            <!-- Logo -->
            <div class="logo-wrapper">
                <img src="../Images/Vector.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">Welcome to RouteWise</h1>
            <p class="subtitle">
                Reset your password and go on an adventure with RouteWise.
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">

                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Email Address</ion-label>
                    <ion-input v-model="this.store.SetPasswordData.EMailAddress" type="email"
                        placeholder="username@example.com" required></ion-input>
                </ion-item>

                <ion-button v-on:click="this.store.SetPasswordEmailVerificationSend()" type="submit" expand="block"
                    class="continue-button" :disabled="!isValid()">
                    Continue
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import { UseStore } from '../stores/store';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
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
            //
        }
    },
    created(){
        this.store.OnboardingStep = 1;
    },
    methods: {
        isValid() {
            var EMailAddress = this.store.SetPasswordData?.EMailAddress;
            return this.store.EMailAddressRegex(EMailAddress) ? true : false
        }   
    },
    watch:{
        'store.SetPasswordData':{
            handler(newVal){
                if(newVal) {
                    var Type = 'setPassword';
                    if( 'VerifySended' in newVal && newVal['VerifySended']){
                        this.$router.push({ path: '/verification/' + this.store.SetPasswordData.EMailAddress + '/' + Type });
                    }
                }
            },
            immediate:true, deep:true
        }
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