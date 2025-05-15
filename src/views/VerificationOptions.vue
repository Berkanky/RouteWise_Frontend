<template>
    <ion-page>
        <ion-content fullscreen color="light">
            <BackButton />
            <div class="logo-wrapper">
                <img src="../Images/VerificationOptionsPageLogo.png" alt="Logo" class="logo" />
            </div>
            <div class="verification">Verification</div>
            <div class="container">
                <p class="description">Choose how you'd like to verify your profile.</p>

                <ion-list>
                    <ion-item button @click="this.verifyEmail()">
                        <ion-icon slot="start" :icon="mailOutline"></ion-icon>
                        <ion-label>
                            <h2>Email</h2>
                            <p>We'll send a verification code your email address.</p>
                        </ion-label>
                        <ion-icon slot="end" :icon="chevronForward"></ion-icon>
                    </ion-item>

                    <ion-item button @click="this.verifyPhone()">
                        <ion-icon slot="start" :icon="callOutline"></ion-icon>
                        <ion-label>
                            <h2>Phone</h2>
                            <p>We'll send an SMS with a verification code to your phone.</p>
                        </ion-label>
                        <ion-icon slot="end" :icon="chevronForward"></ion-icon>
                    </ion-item>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel
} from "@ionic/vue";
import { defineComponent } from "vue";
import { mailOutline, callOutline, chevronForward } from "ionicons/icons";

import { UseStore } from '../stores/store';

export default defineComponent({
    components: {
        IonContent,
        IonList,
        IonItem,
        IonIcon,
        IonLabel,
        IonPage,
        BackButton
    },
    setup() {
        const store = UseStore();
        return {
            mailOutline,
            callOutline,
            chevronForward,
            store
        };
    },
    data() {
        return {
            Type: '',
            VerificationType: '',
        };
    },
    methods: {
        verifyEmail() {
            this.VerificationType = 'Email';

            var Type = this.Type;
            if (Type === 'Login') this.store.LoginEmailVerificationSend();
            if (Type === 'setPassword') this.store.SetPasswordEmailVerificationSend();

        },
        verifyPhone() {
            this.VerificationType = 'SMS';

            var Type = this.Type;
            this.store.SMSVerificationSend(Type);
        },
        ContinueFunction(){
            var Type = this.Type;
            var VerificationType = this.VerificationType;
            var EMailAddress = this.EMailAddress;
            this.$router.push({ path: '/verification/' + EMailAddress + '/' + Type + '/' + VerificationType });
        }
    },
    created() {
        var { EMailAddress, Type } = this.$route.params;

        this.Type = Type;
        this.EMailAddress = EMailAddress;
    },
    watch: {
        'store.LoginData': {
            handler(newVal) {
                if (newVal && 'VerifySended' in newVal && newVal['VerifySended']) {
                    this.ContinueFunction();
                }

            },
            immediate: true, deep: true
        }
    }
});
</script>

<style scoped>
.verification {
    position: relative;
    font-size: 26px;
    line-height: 40px;
    font-weight: 600;
    font-family: Inter;
    color: #000;
    text-align: center;
}

.description {
    color: gray;
    margin-bottom: 20px;
    text-align: center;
}
</style>