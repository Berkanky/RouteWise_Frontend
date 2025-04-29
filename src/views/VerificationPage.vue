<template>
    <ion-page class="otp-page-target">
        <ion-content :fullscreen="true" class="ion-padding">
            <div class="logo-wrapper">
                <img :src="ClockIcon" alt="Routewise Logo" class="logo" />
                <p class="subtitle-target">The verification code will expire in:</p>
                <TimerPill @VerificationIdExpired="getVerificationIdExpired"
                    :VerifySendedCount="this.VerifySendedCount" />

            </div>
            <div class="text-section-target">
                <h1 class="title-target">Enter the Code</h1>
                <p class="subtitle-target">We’ve sent a 6‑digit code to your email.</p>
            </div>

            <ion-item class="input-container" lines="none">
                <ion-input 
                    v-model="this.EMailAddress" type="email"
                    placeholder="username@example.com" disabled required class="custom-input">
                </ion-input>
            </ion-item>

            <ion-item class="input-container" lines="none" style="margin-top:16px;">
                <ion-input v-model="this.VerificationId" type="tel" inputmode="numeric" maxlength="6"
                    placeholder="Enter digit code." class="custom-input" />
            </ion-item>

            <div class="requirements-list">
                <p class="requirement-item requirement-error"
                    v-if="!this.VerificationActive">
                    <ion-icon :icon="closeOutline" style="margin-right:5px;color:red;font-size:15px;"></ion-icon>
                    The verification code has expired, please send the code again.
                </p>
                <p class="requirement-item requirement-error"
                    v-if="!this.isValid()">
                    <ion-icon :icon="closeOutline" style="margin-right:5px;color:red;font-size:15px;"></ion-icon>
                    Please enter a valid code.
                </p>
            </div>

            <div class="buttons-row-target">
                <ion-button expand="block" class="next-btn-target" @click="this.ResendVerificationId()">
                    Resend
                </ion-button>

                <ion-button expand="block" class="next-btn-target"
                    :disabled="!this.isValid() || !this.VerificationActive" @click="this.ConfirmVerificationId()">
                    Next
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import TimerPill from '@/components/TimerPill.vue';
import ClockIcon from '../Images/ClockIcon.png';
import { defineComponent } from 'vue';
import {
    IonPage,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    useIonRouter,
    IonIcon
} from '@ionic/vue';
import { chevronBackOutline, closeOutline } from 'ionicons/icons';
import axios from 'axios';
import { UseStore } from '../stores/store';
export default defineComponent({
    name: 'OtpPageTarget',
    components: {
        IonPage,
        IonButton,
        IonContent,
        IonItem,
        IonInput,
        TimerPill,
        IonIcon,
    },
    setup() {
        const store = UseStore();
        const ionRouter = useIonRouter();
        return {
            ionRouter,
            ioniconsChevronBackOutline: chevronBackOutline,
            store,
            ClockIcon,
            closeOutline
        };
    },
    data() {
        return {
            VerificationId: '',
            EMailAddress: '',
            Type: '',
            VerifySended: false,
            VerifySendedCount: 0,
            VerificationActive: true,
        };
    },
    methods: {
        getVerificationIdExpired(data) {
            if (data === true) this.VerificationActive = false;
        },
        isValid() {
            var codeStr = String(this.VerificationId || '');
            return /^\d{6}$/.test(codeStr);
        },
        ResendVerificationId() {
            var Type = this.Type;

            if (Type === 'Login') return this.store.LoginEmailVerificationSend();
            if (Type === 'Register') return this.store.RegisterEmailVerificationSend();
            if (Type === 'setPassword') return this.store.SetPasswordEmailVerificationSend();
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
                            if (res.status === 200) {
                                this.store.LoginData.Verified = true;
                                this.store.LoginData.VerifySended = false;
                                this.$router.push({ path: '/login' });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            if (err.status === 504) return this.ConfirmVerificationId();
                        })
                }
                if (Type === 'setPassword') {
                    axios.post(`${ServerRoot}/set/password/email/confirm/${EMailAddress}`, { VerificationId: this.VerificationId })
                        .then(res => {
                            console.log(res);
                            if (res.status === 200) {
                                this.store.SetPasswordData.Verified = true;
                                this.store.SetPasswordData.VerifySended = false;
                                this.store.Token = res.data.Token;
                                this.$router.push({ path: '/set/password/complete' });
                            }
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

        this.store.VerificationPageType = Type;
        this.Type = Type;

        this.store.OnboardingStep = 2;

        this.VerificationActive = true;
    },
    watch: {
        'store.SetPasswordData': {
            handler(newVal) {
                if (newVal && 'VerifySended' in newVal && newVal["VerifySended"]) {
                    this.VerifySended = true;
                    this.VerifySendedCount = this.VerifySendedCount + 1;
                }
            },
            immediate: true, deep: true
        },
        'store.RegisterData': {
            handler(newVal) {
                if (newVal && 'VerifySended' in newVal && newVal["VerifySended"]) {
                    this.VerifySended = true;
                    this.VerifySendedCount = this.VerifySendedCount + 1;
                }
            },
            immediate: true, deep: true
        },
        'store.LoginData': {
            handler(newVal) {
                if (newVal && 'VerifySended' in newVal && newVal["VerifySended"]) {
                    this.VerifySended = true;
                    this.VerifySendedCount = this.VerifySendedCount + 1;
                }
            },
            immediate: true, deep: true
        }
    }
});
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

.logo-wrapper {
    text-align: center;
    margin-top: 60px;
}

.logo {
    width: 100px;
    height: auto;
}

.otp-page-target {
    --background: #ffffff;
}

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

.requirements-list {
  width: 100%;
  padding-left: 15px;
  margin-top: 5px;
  margin-bottom: 30px;
}

.requirement-item {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.requirement-valid {
  color: green;
}

.requirement-invalid-text {
  color: #888;
}

.requirement-error {
  color: red;
  font-weight: bold;
}

</style>