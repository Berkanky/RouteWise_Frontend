<template>
    <ion-page class="signup-page">
        <ion-content fullscreen color="light">
            <BackButton />
            <div class="logo-wrapper">
                <img src="../Images/RouteWise-3D-İcon.png" alt="Routewise Logo" class="logo" />
            </div>

            <h1 class="title">Welcome to RouteWise</h1>
            <p class="subtitle">
                Sign up and unlock smarter travel with Routewise.
            </p>

            <form @submit.prevent="onSubmit" class="form">
                <ion-item class="input-container" lines="none">
                    <ion-input 
                        label="Email" label-placement="floating"
                        class="custom-input" v-model="this.store.RegisterData.EMailAddress" type="email"
                        required></ion-input>
                </ion-item>

                <RequirementContainerVue v-if="this.store.RegisterData.EMailAddress && !isValid()" Type="Register"
                    RequirementType="EMailAddress"
                    :IsValid="this.store.EMailAddressRegex(this.store.RegisterData.EMailAddress)" />

                <ion-button
                    v-on:click="this.store.RegisterEmailVerificationSend()" type="submit" expand="block"
                    :class="!isValid() ? 'continue-button-disabled' : 'continue-button'"
                    :disabled="!isValid()">
                    Email Verification
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import RequirementContainerVue from '@/components/RequirementContainer.vue';
import BackButton from '@/components/BackButton.vue';
import { UseStore } from '../stores/store';
import {
    IonPage,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
} from '@ionic/vue';

export default {
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonInput,
        IonButton,
        RequirementContainerVue,
        BackButton
    },
    setup() {
        const store = UseStore();
        return {
            store,
        }
    },
    data: function () {
        return {
            agreements: {
                terms: false,         // Kullanım Koşulları
                privacy: false,       // Gizlilik Politikası ve KVKK
            }
        }
    },
    created() {
        this.store.OnboardingStep = 1;
    },
    methods: {
        isValid() {
            var EMailAddress = this.store.RegisterData?.EMailAddress;
            return this.store.EMailAddressRegex(EMailAddress) ? true : false
        }
    },
    watch: {
        'store.RegisterData': {
            handler(newVal) {
                if (newVal) {
                    var Type = 'Register';
                    var VerificationType = "Email";

                    if ('VerifySended' in newVal && newVal['VerifySended']) {
                        this.$router.push({ path: '/verification/' + this.store.RegisterData.EMailAddress + '/' + Type + '/' + VerificationType });
                    }
                }
            },
            immediate: true, deep: true
        }
    }
}
</script>