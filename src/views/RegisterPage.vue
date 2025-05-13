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

            <!-- <div class="map-container">
                <img src="../Images/RouteWiseMapV2.png" alt="Map Background" class="map-bg" />
            </div> -->
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

<style scoped>
.inputLabels {
    font-weight: bold;
}

.signup-page {
    --background: #ffffff;
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
    --highlight-color-focused: #000000;
}

.centered-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    min-height: 100px;
}

.round-icon-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;

    --background: white;
    color: black;

    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;
}


.round-icon-button-active {
    width: 50px;
    height: 50px;
    border-radius: 50%;

    --background: #e4002b;
    color: #fff;

    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;
}

.round-icon-button ion-icon {
    color: black;
    font-size: 24px;
}


.round-icon-button-active ion-icon {
    color: #fff;
    font-size: 24px;
}

.map-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    z-index: 1;
}

.map-bg {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
}

.map-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to bottom,
            #ffffff 30%,
            rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 2;
}

.map-container::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top,
            #ffffff 30%,
            rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 2;
}
</style>