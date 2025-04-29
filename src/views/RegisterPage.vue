<template>
    <ion-page class="signup-page">
        <ion-content fullscreen>
            <!-- Logo -->
            <div class="logo-wrapper">
                <img src="../Images/RouteWise-3D-İcon.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">Welcome to RouteWise</h1>
            <p class="subtitle">
                Sign up and unlock smarter travel with Routewise.
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">
                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Email Address</ion-label> -->
                    <ion-input 
                        class="custom-input"
                        v-model="this.store.RegisterData.EMailAddress" type="email"
                        placeholder="username@example.com" required></ion-input>
                </ion-item>

                <RequirementContainerVue
                    Type="Register"
                    RequirementType="EMailAddress"
                    :IsValid="this.store.EMailAddressRegex(this.store.RegisterData.EMailAddress)"
                />

                <ion-button v-on:click="this.store.RegisterEmailVerificationSend()" type="submit" expand="block"
                    class="continue-button" :disabled="!isValid()">
                    Continue
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import RequirementContainerVue from '@/components/RequirementContainer.vue';

import { UseStore } from '../stores/store';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
export default {
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonButton,
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
            //
        }
    },
    created(){
        this.store.OnboardingStep = 1;
    },
    methods: {
        isValid() {
            var EMailAddress = this.store.RegisterData?.EMailAddress;
            return this.store.EMailAddressRegex(EMailAddress) ? true : false
        }   
    },
    watch:{
        'store.RegisterData':{
            handler(newVal){
                if(newVal) {
                    var Type = 'Register';
                    if( 'VerifySended' in newVal && newVal['VerifySended']){
                        this.$router.push({ path: '/verification/' + this.store.RegisterData.EMailAddress + '/' + Type });
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

.continue-button {
    --background: #e4002b;
    --border-radius: 24px;
    color: #fff;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    text-transform: none;
}
</style>