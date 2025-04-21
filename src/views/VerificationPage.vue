<template>
    <ion-page class="otp-page-target">

        <ion-content :fullscreen="true" class="ion-padding">
            <div class="text-section-target">
                <h1 class="title-target">Enter the Code</h1>
                <p class="subtitle-target">We’ve sent a 6‑digit code to your email.</p>
            </div>

            <ion-item class="input-item" lines="none">
                <ion-input 
                    v-if="this.Type == 'Login'"
                    v-model="this.store.LoginData.EMailAddress" 
                    type="email" 
                    placeholder="username@example.com"
                    disabled
                    required
                    class="otp-input-target"
                    >
                </ion-input>
                <ion-input 
                    v-if="this.Type == 'Register'"
                    v-model="this.store.RegisterData.EMailAddress" 
                    type="email" 
                    placeholder="username@example.com"
                    disabled
                    required
                    class="otp-input-target"
                    >
                </ion-input>
            </ion-item>

            <ion-item class="otp-item-target" lines="none" style="margin-top:16px;">
                <ion-input v-model="this.VerificationId" type="tel" inputmode="numeric" maxlength="6"
                    placeholder="Enter 6‑digit code" class="otp-input-target" />
            </ion-item>

            <div class="buttons-row-target">
                <ion-button expand="block" class="next-btn-target" @click="this.ResendVerificationId()">
                    Resend
                </ion-button>

                <ion-button expand="block" class="next-btn-target" :disabled="!this.isValid()"
                    @click="this.ConfirmVerificationId()">
                    Next
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
    IonPage,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    useIonRouter
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import axios from 'axios';
import { UseStore } from '../stores/store';
export default defineComponent({
    name: 'OtpPageTarget',
    components: {
        IonPage,
        IonButton,
        IonContent,
        IonItem,
        IonInput
    },
    setup() {
        const store = UseStore();
        const ionRouter = useIonRouter();
        return {
            ionRouter,
            ioniconsChevronBackOutline: chevronBackOutline,
            store
        };
    },
    data() {
        return {
            VerificationId: '',
            EMailAddress: '',
            Type: ''
        };
    },
    computed: {
    },
    methods: {
        isValid() {
            var codeStr = String(this.VerificationId || '');
            console.log('isValid : ', /^\d{6}$/.test(codeStr));
            return /^\d{6}$/.test(codeStr);
        },
        ResendVerificationId() {
            console.log('Resend code clicked');
        },
        ConfirmVerificationId() {
            if (this.isValid) {
                var ServerRoot = this.store.ServerRoot;
                var EMailAddress = this.EMailAddress;
                var Type = this.Type;
                if (Type === 'Register') {
                    axios.post(`${ServerRoot}/register/email/verification/confirm/${EMailAddress}`, { VerificationId: this.VerificationId })
                        .then(res => {
                            console.log(res);
                            if (res.status === 200) this.$router.push({ path: '/register/complete' });
                        })
                        .catch(err => {
                            console.log(err);
                            if (err.status === 504) return this.ConfirmVerificationId();
                        })
                }
                if (Type === 'Login') {
                    axios.post(`${ServerRoot}/login/email/verification/confirm/${EMailAddress}`, { VerificationId: this.VerificationId })
                        .then(res => {
                            console.log(res);
                            if (res.status === 200) this.store.LoginData.Verified = true, this.$router.push({ path: '/login' });
                        })
                        .catch(err => {
                            console.log(err);
                            if (err.status === 504) return this.ConfirmVerificationId();
                        })
                }
            }
        },
        goBack() {
            if (this.ionRouter.canGoBack()) this.ionRouter.back();
            else this.ionRouter.replace('/login');
        },
    },
    created() {
        var { EMailAddress, Type } = this.$route.params;
        this.EMailAddress = EMailAddress;
        this.Type = Type;
        console.log("Verification Email : ", this.EMailAddress);
        console.log("Verification Type : ", this.Type);
    }
});
</script>

<style scoped>
.otp-page-target {
    --background: #ffffff;
}

ion-header {}

ion-toolbar {
    --background: #ffffff;
    --border-width: 0 !important;
    box-shadow: none;
    padding-top: env(safe-area-inset-top);
    --min-height: 50px;
}

.back-button-custom {
    --background: #e4002b;
    --background-hover: #c00024;
    --color: #ffffff;
    width: 36px;
    height: 36px;
    --border-radius: 50% !important;
    border-radius: 50% !important;
    margin-left: 16px;
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 0;
    --padding-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-button-custom ion-icon {
    font-size: 20px;
}

.text-section-target {
    text-align: center;
    margin-top: 40px;
    margin-bottom: 30px;
    padding: 0 16px;
}

.title-target {
    font-size: 24px;
    font-weight: 600;
    color: #000;
    margin-bottom: 12px;
}

.subtitle-target {
    font-size: 14px;
    color: #666;
}

.otp-item-target {
    --background: transparent;
    --padding-start: 16px;
    --padding-end: 16px;
    --inner-padding-end: 0;
    --min-height: 50px;
    margin-bottom: 16px;
}

.otp-input-target {
    border: 1px solid #dcdcdc;
    border-radius: 25px;
    --padding-start: 20px;
    --padding-end: 20px;
    font-size: 16px;
    text-align: left;
    letter-spacing: normal;
}

.resend-text-section {
    text-align: center;
    margin-bottom: 30px;
    padding: 0 16px;
}

.resend-text-section p {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.resend-link {
    color: #e4002b;
    font-weight: 500;
    cursor: pointer;
}

.buttons-row-target {
    display: flex;
    gap: 12px;
    padding: 0 16px;
    align-items: center;
}

.resend-btn-target {
    flex: 0 0 110px;
    --border-radius: 24px;
    --border-width: 1px;
    --border-color: #e4002b;
    --background: #ffffff;
    --background-activated: #f0f0f0;
    --color: #e4002b;
    --padding-top: 12px;
    --padding-bottom: 12px;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    text-transform: none;
}

.next-btn-target {
    flex: 1;
    --border-radius: 24px;
    --background: #e4002b;
    --background-activated: #c00024;
    --background-focused: #c00024;
    --color: #ffffff;
    --padding-top: 12px;
    --padding-bottom: 12px;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    text-transform: none;
}

.next-btn-target[disabled] {
    --background: #fecdd3;
    opacity: 1;
}
</style>